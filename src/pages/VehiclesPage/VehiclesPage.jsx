import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchVehicles } from '../../features/vehicles/vehiclesSlice'
import {
  selectBrands,
  selectFilteredVehicles,
} from '../../features/vehicles/vehiclesSelectors'
import {
  resetFilters,
  setBrand,
  setMaxPrice,
  setMinPrice,
  setQuery,
} from '../../features/filters/filtersSlice'
import styles from './VehiclesPage.module.css'

function Field({ label, children }) {
  return (
    <label className={styles.field}>
      <span className={styles.label}>{label}</span>
      {children}
    </label>
  )
}

export default function VehiclesPage() {
  const dispatch = useAppDispatch()
  const status = useAppSelector((s) => s.vehicles.status)
  const error = useAppSelector((s) => s.vehicles.error)
  const filters = useAppSelector((s) => s.filters)
  const brands = useAppSelector(selectBrands)
  const vehicles = useAppSelector(selectFilteredVehicles)

  useEffect(() => {
    dispatch(fetchVehicles())
  }, [dispatch])

  const brandOptions = useMemo(() => ['all', ...brands], [brands])

  return (
    <section className={styles.page}>
      <div className={styles.top}>
        <div>
          <h1 className={styles.h1}>Vehicles</h1>
          <p className={styles.sub}>
            Loaded once and cached in Redux Store. Open any vehicle without extra requests.
          </p>
        </div>
        <button className={styles.resetBtn} type="button" onClick={() => dispatch(resetFilters())}>
          Reset
        </button>
      </div>

      <div className={styles.filters} role="region" aria-label="Filters">
        <Field label="Search">
          <input
            className={styles.input}
            value={filters.query}
            onChange={(e) => dispatch(setQuery(e.target.value))}
            placeholder="Title / brand / description"
            inputMode="search"
          />
        </Field>

        <Field label="Brand">
          <select
            className={styles.select}
            value={filters.brand}
            onChange={(e) => dispatch(setBrand(e.target.value))}
          >
            {brandOptions.map((b) => (
              <option key={b} value={b}>
                {b === 'all' ? 'All brands' : b}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Min price">
          <input
            className={styles.input}
            value={filters.minPrice}
            onChange={(e) => dispatch(setMinPrice(e.target.value.replace(/[^\d]/g, '')))}
            placeholder="0"
            inputMode="numeric"
          />
        </Field>

        <Field label="Max price">
          <input
            className={styles.input}
            value={filters.maxPrice}
            onChange={(e) => dispatch(setMaxPrice(e.target.value.replace(/[^\d]/g, '')))}
            placeholder="99999"
            inputMode="numeric"
          />
        </Field>
      </div>

      {status === 'loading' && <div className={styles.state}>Loading vehicles…</div>}
      {status === 'failed' && <div className={styles.stateError}>Error: {error}</div>}

      {status === 'succeeded' && (
        <>
          <div className={styles.meta}>{vehicles.length} vehicles</div>
          <div className={styles.grid} role="list">
            {vehicles.map((v) => (
              <article className={styles.card} key={v.id} role="listitem">
                <div className={styles.cardTop}>
                  <div className={styles.thumbWrap}>
                    <img
                      className={styles.thumb}
                      src={v.thumbnail}
                      alt={v.title}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.cardBody}>
                    <h2 className={styles.h2}>{v.title}</h2>
                    <div className={styles.kv}>
                      <span className={styles.k}>Brand</span>
                      <span className={styles.v}>{v.brand ?? '—'}</span>
                    </div>
                    <div className={styles.kv}>
                      <span className={styles.k}>Price</span>
                      <span className={styles.v}>${v.price}</span>
                    </div>
                  </div>
                </div>
                <p className={styles.desc}>{v.description}</p>
                <Link className={styles.openBtn} to={`/vehicles/${v.id}`}>
                  Open details
                </Link>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

