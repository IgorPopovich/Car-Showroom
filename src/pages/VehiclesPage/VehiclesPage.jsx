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
    <label className={styles['vehicles-page__field']}>
      <span className={styles['vehicles-page__label']}>{label}</span>
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
    <section className={styles['vehicles-page']}>
      <div className={styles['vehicles-page__top']}>
        <div>
          <h1 className={styles['vehicles-page__title']}>Vehicles</h1>
          <p className={styles['vehicles-page__subtitle']}>
            Loaded once and cached in Redux Store. Open any vehicle without extra requests.
          </p>
        </div>
        <button
          className={styles['vehicles-page__reset']}
          type="button"
          onClick={() => dispatch(resetFilters())}
        >
          Reset
        </button>
      </div>

      <div className={styles['vehicles-page__filters']} role="region" aria-label="Filters">
        <Field label="Search">
          <input
            className={styles['vehicles-page__input']}
            value={filters.query}
            onChange={(e) => dispatch(setQuery(e.target.value))}
            placeholder="Title / brand / description"
            inputMode="search"
          />
        </Field>

        <Field label="Brand">
          <select
            className={styles['vehicles-page__select']}
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
            className={styles['vehicles-page__input']}
            value={filters.minPrice}
            onChange={(e) => dispatch(setMinPrice(e.target.value.replace(/[^\d]/g, '')))}
            placeholder="0"
            inputMode="numeric"
          />
        </Field>

        <Field label="Max price">
          <input
            className={styles['vehicles-page__input']}
            value={filters.maxPrice}
            onChange={(e) => dispatch(setMaxPrice(e.target.value.replace(/[^\d]/g, '')))}
            placeholder="99999"
            inputMode="numeric"
          />
        </Field>
      </div>

      {status === 'loading' && (
        <div className={styles['vehicles-page__state']}>Loading vehicles…</div>
      )}
      {status === 'failed' && (
        <div className={styles['vehicles-page__state--error']}>Error: {error}</div>
      )}

      {status === 'succeeded' && (
        <>
          <div className={styles['vehicles-page__meta']}>{vehicles.length} vehicles</div>
          <div className={styles['vehicles-page__grid']} role="list">
            {vehicles.map((v) => (
              <article className={styles['vehicles-page__card']} key={v.id} role="listitem">
                <div className={styles['vehicles-page__card-top']}>
                  <div className={styles['vehicles-page__thumb-wrap']}>
                    <img
                      className={styles['vehicles-page__thumb']}
                      src={v.thumbnail}
                      alt={v.title}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles['vehicles-page__card-body']}>
                    <h2 className={styles['vehicles-page__card-title']}>{v.title}</h2>
                    <div className={styles['vehicles-page__spec']}>
                      <span className={styles['vehicles-page__spec-name']}>Brand</span>
                      <span className={styles['vehicles-page__spec-value']}>{v.brand ?? '—'}</span>
                    </div>
                    <div className={styles['vehicles-page__spec']}>
                      <span className={styles['vehicles-page__spec-name']}>Price</span>
                      <span className={styles['vehicles-page__spec-value']}>${v.price}</span>
                    </div>
                  </div>
                </div>
                <p className={styles['vehicles-page__description']}>{v.description}</p>
                <Link className={styles['vehicles-page__open-link']} to={`/vehicles/${v.id}`}>
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
