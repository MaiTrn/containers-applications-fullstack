const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + blog.likes;
  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }
  const likes = blogs.map((blog) => blog.likes);
  const favouriteBlogIndex = likes.indexOf(Math.max(...likes));

  return blogs[favouriteBlogIndex];
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }

  const authorList = [];
  blogs.forEach((b) => {
    if (authorList.some((a) => a.author == b.author)) {
      authorList.forEach((a) => {
        if (a.author === b.author) {
          a.blogs++;
        }
      });
    } else {
      const a = { author: b.author, blogs: 1 };
      authorList.push(a);
    }
  });
  const numberOfBlogs = authorList.map((author) => author.blogs);
  const favouriteAuthorIndex = numberOfBlogs.indexOf(
    Math.max(...numberOfBlogs)
  );

  return authorList[favouriteAuthorIndex];
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0;
  }

  const authorList = [];
  blogs.forEach((b) => {
    if (authorList.some((a) => a.author == b.author)) {
      authorList.forEach((a) => {
        if (a.author === b.author) {
          a.likes += b.likes;
        }
      });
    } else {
      const a = { author: b.author, likes: b.likes };
      authorList.push(a);
    }
  });
  const numberOfLikes = authorList.map((author) => author.likes);
  const favouriteAuthorIndex = numberOfLikes.indexOf(
    Math.max(...numberOfLikes)
  );
  return authorList[favouriteAuthorIndex];
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
