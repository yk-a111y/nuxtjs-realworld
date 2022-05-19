import { request } from '@/plugins/request'

// 文章获取
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/api/articles',
    params
  })
}

// 标签获取
export const getTags = () => {
  return request({
    method: 'GET',
    url: '/api/tags'
  })
}

// 获取关注用户的文章列表
export const getFeedArticles = params => {
  return request({
    method: 'GET',
    url: '/api/articles/feed',
    // headers: {
    //   Authorization: `Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InlrMTk5ODA4MTFAMTYzLmNvbSIsInVzZXJuYW1lIjoieWtreSIsImlhdCI6MTY1MjkwMTY0OSwiZXhwIjoxNjU4MDg1NjQ5fQ.NoxTOEjLteWvttUzbIf3i0g37urA6DpWuPgO0edVyt4`
    // },
    params
  })
}

// 添加点赞
export const addFavorite = slug => {
  return request({
    method: 'POST',
    url: '/api/articles/${slug}/favorite'
  })
}

// 取消点赞
export const deleteFavorite = slug => {
  return request({
    method: 'DELETE',
    url: '/api/articles/${slug}/favorite'
  })
}

// 文章详情
export const getArticle = slug => {
  return request({
    method: 'GET',
    url: `/api/articles/${slug}`
  })
}

// 获取文章评论
export const getComments = slug => {
  return request({
    method: 'GET',
    url: `/api/articles/${slug}/comments`
  })
}