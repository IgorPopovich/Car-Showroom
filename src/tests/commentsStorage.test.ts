import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loadAllComments, saveAllComments } from '../features/comments/commentsStorage'

describe('commentsStorage', () => {
  const getItem = vi.fn()
  const setItem = vi.fn()

  beforeEach(() => {
    getItem.mockReset()
    setItem.mockReset()
    vi.stubGlobal('localStorage', { getItem, setItem })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('loadAllComments returns {} when key missing', () => {
    getItem.mockReturnValue(null)
    expect(loadAllComments()).toEqual({})
  })

  it('loadAllComments returns {} on invalid JSON', () => {
    getItem.mockReturnValue('{')
    expect(loadAllComments()).toEqual({})
  })

  it('loadAllComments returns {} when parsed value is not an object', () => {
    getItem.mockReturnValue(JSON.stringify('string'))
    expect(loadAllComments()).toEqual({})
  })

  it('loadAllComments returns parsed object when valid', () => {
    const data = { '1': [{ id: 'a', author: 'x', text: 'y', createdAt: 1 }] }
    getItem.mockReturnValue(JSON.stringify(data))
    expect(loadAllComments()).toEqual(data)
  })

  it('saveAllComments writes JSON to localStorage', () => {
    const map = { '2': [] }
    saveAllComments(map)
    expect(setItem).toHaveBeenCalledWith(
      'car_showroom_comments_v1',
      JSON.stringify(map),
    )
  })

  it('saveAllComments ignores setItem errors', () => {
    setItem.mockImplementation(() => {
      throw new Error('quota')
    })
    expect(() => saveAllComments({})).not.toThrow()
  })
})
