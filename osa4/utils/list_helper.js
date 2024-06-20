const dummy = (blogs) => {
    return 1
  }

/// kaikki tykkäykset
  
  const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }


/// tykätyin blogi

  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
  
  
    const favorite = blogs.reduce((prev, current) => {
      return (current.likes > prev.likes) ? current : prev
    })
  

    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes
    }
  }

/// eniten blogeja

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
      return null
    }
  
    const authorCounts = {}
    let maxBlogs = 0
    let mostBlogsAuthor = null
  
    blogs.forEach((blog) => {
      if (authorCounts[blog.author]) {
        authorCounts[blog.author]++
      } else {
        authorCounts[blog.author] = 1
      }
  
      if (authorCounts[blog.author] > maxBlogs) {
        maxBlogs = authorCounts[blog.author]
        mostBlogsAuthor = blog.author
      }
    })
  
    return {
      author: mostBlogsAuthor,
      blogs: maxBlogs,
    }
  }
  

/// eniten likejä kirjoittajalla

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorLikes = {}
  let maxLikes = 0
  let mostLikedAuthor = null

  blogs.forEach((blog) => {
    if (authorLikes[blog.author]) {
      authorLikes[blog.author] += blog.likes
    } else {
      authorLikes[blog.author] = blog.likes
    }

    if (authorLikes[blog.author] > maxLikes) {
      maxLikes = authorLikes[blog.author]
      mostLikedAuthor = blog.author
    }
  })

  return {
    author: mostLikedAuthor,
    likes: maxLikes,
  }
}


  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }
  