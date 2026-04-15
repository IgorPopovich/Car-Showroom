import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchVehicleById } from '../../features/vehicles/vehiclesSlice'
import { selectVehicleById } from '../../features/vehicles/vehiclesSelectors'
import {
  addComment,
  deleteComment,
  selectCommentsForVehicle,
} from '../../features/comments/commentsSlice'
import styles from './VehicleDetailsPage.module.css'

const MAX_AUTHOR = 40
const MAX_TEXT = 220

export default function VehicleDetailsPage() {
  const { vehicleId } = useParams()
  const dispatch = useAppDispatch()

  const vehicle = useAppSelector((s) => selectVehicleById(s, vehicleId))
  const comments = useAppSelector((s) => selectCommentsForVehicle(s, vehicleId))

  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (!vehicleId) return
    dispatch(fetchVehicleById(vehicleId))
  }, [dispatch, vehicleId])

  const authorErr = useMemo(() => {
    if (!touched) return ''
    const v = author.trim()
    if (!v) return 'Author is required.'
    if (v.length > MAX_AUTHOR) return `Max ${MAX_AUTHOR} chars.`
    return ''
  }, [author, touched])

  const textErr = useMemo(() => {
    if (!touched) return ''
    const v = text.trim()
    if (!v) return 'Comment is required.'
    if (v.length > MAX_TEXT) return `Max ${MAX_TEXT} chars.`
    return ''
  }, [text, touched])

  const canSubmit = !authorErr && !textErr && author.trim() && text.trim()

  function onSubmit(e) {
    e.preventDefault()
    setTouched(true)
    if (!canSubmit) return
    dispatch(addComment({ vehicleId, author: author.trim(), text: text.trim() }))
    setText('')
  }

  return (
    <section className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Link className={styles.back} to="/">
          ← Back to list
        </Link>
      </div>

      {!vehicle && (
        <div className={styles.state}>
          Loading vehicle…
          <div className={styles.stateSub}>
            If you opened this page directly, we fetch only this vehicle once.
          </div>
        </div>
      )}

      {vehicle && (
        <>
          <div className={styles.header}>
            <div className={styles.titleWrap}>
              <h1 className={styles.h1}>{vehicle.title}</h1>
              <div className={styles.meta}>
                <span className={styles.pill}>{vehicle.brand ?? '—'}</span>
                <span className={styles.pill}>${vehicle.price}</span>
                <span className={styles.pill}>Rating {vehicle.rating}</span>
              </div>
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.gallery}>
              <img className={styles.hero} src={vehicle.thumbnail} alt={vehicle.title} />
              {Array.isArray(vehicle.images) && vehicle.images.length > 1 && (
                <div className={styles.thumbRow}>
                  {vehicle.images.slice(0, 6).map((src) => (
                    <img key={src} className={styles.tiny} src={src} alt="" loading="lazy" />
                  ))}
                </div>
              )}
            </div>

            <div className={styles.details}>
              <div className={styles.block}>
                <h2 className={styles.h2}>About</h2>
                <p className={styles.desc}>{vehicle.description}</p>
              </div>

              <div className={styles.block}>
                <h2 className={styles.h2}>Comments</h2>

                <form className={styles.form} onSubmit={onSubmit}>
                  <div className={styles.formRow}>
                    <label className={styles.field}>
                      <span className={styles.label}>Author</span>
                      <input
                        className={styles.input}
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        onBlur={() => setTouched(true)}
                        placeholder="Your name"
                      />
                      {authorErr && <span className={styles.err}>{authorErr}</span>}
                    </label>

                    <button className={styles.btn} type="submit">
                      Add
                    </button>
                  </div>

                  <label className={styles.field}>
                    <span className={styles.label}>Comment</span>
                    <textarea
                      className={styles.textarea}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onBlur={() => setTouched(true)}
                      placeholder="What do you think?"
                      rows={4}
                    />
                    <div className={styles.hintRow}>
                      <span className={styles.hint}>
                        {text.trim().length}/{MAX_TEXT}
                      </span>
                      {textErr && <span className={styles.err}>{textErr}</span>}
                    </div>
                  </label>
                </form>

                <div className={styles.list}>
                  {comments.length === 0 ? (
                    <div className={styles.empty}>No comments yet.</div>
                  ) : (
                    comments.map((c) => (
                      <article className={styles.comment} key={c.id}>
                        <div className={styles.commentTop}>
                          <div className={styles.commentAuthor}>{c.author}</div>
                          <div className={styles.commentRight}>
                            <time className={styles.time}>
                              {new Date(c.createdAt).toLocaleString()}
                            </time>
                            <button
                              className={styles.del}
                              type="button"
                              onClick={() =>
                                dispatch(deleteComment({ vehicleId, commentId: c.id }))
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className={styles.commentText}>{c.text}</div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}

