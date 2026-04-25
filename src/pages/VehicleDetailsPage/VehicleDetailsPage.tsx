import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
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

type VehicleDetailsElementClass =
  | 'breadcrumbs'
  | 'back'
  | 'state'
  | 'state-sub'
  | 'header'
  | 'title-wrap'
  | 'title'
  | 'meta'
  | 'pill'
  | 'content'
  | 'gallery'
  | 'hero'
  | 'thumbs'
  | 'thumb'
  | 'details'
  | 'section'
  | 'heading'
  | 'text'
  | 'form'
  | 'form-author'
  | 'form-author-label'
  | 'form-author-actions'
  | 'field'
  | 'label'
  | 'input'
  | 'textarea'
  | 'submit'
  | 'hint-row'
  | 'hint'
  | 'error'
  | 'comments'
  | 'empty'
  | 'comment'
  | 'comment-header'
  | 'comment-author'
  | 'comment-actions'
  | 'time'
  | 'delete'
  | 'comment-text'

function s(name: VehicleDetailsElementClass): string {
  const key = `vehicle-details__${name}` as keyof typeof styles
  return styles[key]
}

export default function VehicleDetailsPage() {
  const { vehicleId } = useParams()
  const dispatch = useAppDispatch()

  const vehicle = useAppSelector((state) => selectVehicleById(state, vehicleId))
  const comments = useAppSelector((state) => selectCommentsForVehicle(state, vehicleId))

  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (vehicleId === undefined) return
    void dispatch(fetchVehicleById(vehicleId))
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

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setTouched(true)
    if (!canSubmit || vehicleId === undefined) return
    dispatch(addComment({ vehicleId, author: author.trim(), text: text.trim() }))
    setAuthor('')
    setText('')
    setTouched(false)
  }

  return (
    <section className={styles['vehicle-details']}>
      <div className={s('breadcrumbs')}>
        <Link className={s('back')} to="/">
          ← Back to list
        </Link>
      </div>

      {!vehicle && (
        <div className={s('state')}>
          Loading vehicle…
          <div className={s('state-sub')}>
            If you opened this page directly, we fetch only this vehicle once.
          </div>
        </div>
      )}

      {vehicle && (
        <>
          <div className={s('header')}>
            <div className={s('title-wrap')}>
              <h1 className={s('title')}>{vehicle.title}</h1>
              <div className={s('meta')}>
                <span className={s('pill')}>{vehicle.brand ?? '—'}</span>
                <span className={s('pill')}>${vehicle.price}</span>
                <span className={s('pill')}>Rating {vehicle.rating}</span>
              </div>
            </div>
          </div>

          <div className={s('content')}>
            <div className={s('gallery')}>
              <img className={s('hero')} src={vehicle.thumbnail} alt={vehicle.title} />
              {Array.isArray(vehicle.images) && vehicle.images.length > 1 && (
                <div className={s('thumbs')}>
                  {vehicle.images.slice(0, 6).map((src) => (
                    <img key={src} className={s('thumb')} src={src} alt="" loading="lazy" />
                  ))}
                </div>
              )}
            </div>

            <div className={s('details')}>
              <div className={s('section')}>
                <h2 className={s('heading')}>About</h2>
                <p className={s('text')}>{vehicle.description}</p>
              </div>

              <div className={s('section')}>
                <h2 className={s('heading')}>Comments</h2>

                <form className={s('form')} onSubmit={onSubmit}>
                  <div className={s('form-author')}>
                    <label className={s('form-author-label')} htmlFor="vehicle-comment-author">
                      Author
                    </label>
                    <div className={s('form-author-actions')}>
                      <input
                        id="vehicle-comment-author"
                        className={s('input')}
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        onBlur={() => setTouched(true)}
                        placeholder="Your name"
                      />
                      <button className={s('submit')} type="submit">
                        Add
                      </button>
                    </div>
                    {authorErr && <span className={s('error')}>{authorErr}</span>}
                  </div>

                  <label className={s('field')}>
                    <span className={s('label')}>Comment</span>
                    <textarea
                      className={s('textarea')}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onBlur={() => setTouched(true)}
                      placeholder="What do you think?"
                      rows={4}
                    />
                    <div className={s('hint-row')}>
                      <span className={s('hint')}>
                        {text.trim().length}/{MAX_TEXT}
                      </span>
                      {textErr && <span className={s('error')}>{textErr}</span>}
                    </div>
                  </label>
                </form>

                <div className={s('comments')}>
                  {comments.length === 0 ? (
                    <div className={s('empty')}>No comments yet.</div>
                  ) : (
                    comments.map((c) => (
                      <article className={s('comment')} key={c.id}>
                        <div className={s('comment-header')}>
                          <div className={s('comment-author')}>{c.author}</div>
                          <div className={s('comment-actions')}>
                            <time className={s('time')}>
                              {new Date(c.createdAt).toLocaleString()}
                            </time>
                            <button
                              className={s('delete')}
                              type="button"
                              onClick={() => {
                                if (vehicleId === undefined) return
                                dispatch(deleteComment({ vehicleId, commentId: c.id }))
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className={s('comment-text')}>{c.text}</div>
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
