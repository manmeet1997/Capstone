// routes/newsRoutes.js
require('dotenv').config();
const request = require('request');
const axios = require('axios');
const express = require('express');
const router = express.Router();
const News = require('../models/News.js');
const cron = require('node-cron');
const apiKey = process.env.NEWS_API_KEY;
const summarizeapi = process.env.MEANINGCLOUD_API_KEY;
const cheerio = require('cheerio');
const excludeElements = ['header', 'footer', 'nav', 'aside'];

const scrapeContent = (html) => {
  const $ = cheerio.load(html);
  let content = '';
  excludeElements.forEach((element) => {
    $(element).remove();
  });

  // Traverse the DOM and concatenate text in order
  $('body *').each((_index, element) => {

    const tagName = element.name;
    const text = $(element).text();

    // Append text to the content string based on the HTML element
    switch (tagName) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        content += `\n${text}.\n`; // Add extra newlines after headings
        break;
      case 'p':
        content += `\n${text}.\n`; // Add extra newlines after paragraphs
        break;
      case 'ul':
      case 'ol':
        content += `\n${text}.\n`; // Add extra newlines after lists
        break;
      // Add cases for other HTML elements if needed
    }
  });

  return { content: content.trim() };
};


const getHtmlFromBody = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.warn(`Error fetching HTML from ${url}:`, error.message);
    return null; // Return null for all errors
  }
};

const summarizeContent = async (content) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: 'https://api.meaningcloud.com/summarization-1.0',
      formData: {
        key: summarizeapi,
        txt: content,
        sentences: '4' // You can adjust the number of sentences in the summary
      }
    };

    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        const summary = JSON.parse(body).summary; // Parse the response and extract the summary
        resolve(summary); // Resolve with the summary
      }
    });
  });
};

const fetchDataAndStoreInMongoDB = async () => {
  try {

    //Using the below only for testing purpose
    //const categories = ['sports'];
    const categories = [ 'sports', 'health', 'science', 'technology', 'business', 'entertainment']; // Specify the categories to fetch

    for (const category of categories) {
      const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`);
      const articles = response.data.articles;

      // Store each article in MongoDB
      for (const article of articles) {
        let existingArticle;
        if (article.id || article.id === null || article.id === 'null') {
          // Check if an article with the same ID already exists in the database
          existingArticle = await News.findOne({ ID: article.id });
        } else if (article.title) {
          // Check if an article with the same title already exists in the database
          existingArticle = await News.findOne({ title: article.title });
        }

        if (existingArticle) {
          // console.log(`Article with ID ${article.id || 'N/A'} or title ${article.title || 'N/A'} already exists. Skipping...`);
          continue;
        }
        // Fetch content from the body of the website
        const html = await getHtmlFromBody(article.url);
        // Skip processing if HTML is null (403 error)
        if (html === null) {
          continue;
        }
      const { content } = scrapeContent(html);
      // Use the MeaningCloud Summarization API to summarize the content

      const summary = await summarizeContent(content);
      // console.log(summary);

      // Create a new News document
      const newsSource = new News({
        ID: article.id,
        title: article.title,
        author: article.author,
        description: article.description,
        url: article.url,
        category: category,
        content: content,
        summary: summary, // Add the scraped content to the News document
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt
      });

      // Save the news source to the database
      await newsSource.save();
    }
  }
  console.log('Data fetched and stored successfully!');
} catch (error) {
  console.error('Error fetching or storing data:', error.message);
}
};

// Schedule the fetchDataAndStoreInMongoDB function to run every 30 minutes
// cron.schedule('*/15 * * * *', async () => {


//cron.schedule('0 0 * * *', async () => {
// Schedule the fetchDataAndStoreInMongoDB function to run every midnight
cron.schedule('*/3 * * * *', async () => {
// cron.schedule('0 0 * * *', async () => {
  try {
    await fetchDataAndStoreInMongoDB();
    console.log('Data fetched and stored successfully!');
  } catch (error) {
    console.error('Error fetching or storing data:', error.message);
  }
});

router.get('/fetchDataAndStoreInMongoDB', (req, res) => {
  res.json({ message: 'Fetching data and storing in MongoDB scheduled successfully!' });
});


// Get all news
router.get('/', async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new news article
router.post('/', async (req, res) => {
  const { ID, title, author, description, url, category, summary, urlToImage, publishedAt } = req.body;

    try {
      const newNews = await News.create({ ID, title, author, description, url, category, summary, urlToImage, publishedAt });
      res.json(newNews);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

//Get a specific news article by ID
router.get('/id/:id', async (req, res) => {
    const newsId = req.params.id;
    try {
      const news = await News.findById(newsId);
  
      if (!news) {
        return res.status(404).json({ error: 'News not found' });
      }
  
      res.json(news);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a news article by ID (PUT)
router.put('/id/:id', async (req, res) => {
  const newsId = req.params.id;
  const { title, author, description, url, category, summary, urlToImage, publishedAt } = req.body;

  try {
    const updatedNews = await News.findByIdAndUpdate(
      newsId,
      { title, author, description, url, category, summary, urlToImage, publishedAt },
      { new: true } // Return the updated document
    );

    if (!updatedNews) {
      return res.status(404).json({ error: 'News not found' });
    }

    res.json({ message: 'News updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
// Delete a news article by ID
router.delete('/id/:id', async (req, res) => {
  const newsId = req.params.id;

  try {
    const deletedNews = await News.findByIdAndDelete(newsId);

    if (!deletedNews) {
      return res.status(404).json({ error: 'News not found' });
    }

    res.json({message: 'News deleted successfully' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});


// Get a specific news article by title
router.get('/title/:title', async (req, res) => {
    const newsTitle = req.params.title;
    try {
        console.log('Searching for news with title:', newsTitle);
        const escapedTitle = newsTitle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const news = await News.findOne({ title: { $regex: new RegExp(escapedTitle, 'i') } });

        if (!news) {
            console.log('News not found');
            return res.status(404).json({ error: 'News not found' });
        }

        console.log('Found news:', news);
        res.json(news);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a new news article by title
router.post('/title/:title', async (req, res) => {
  const { description, url, category, summary, urlToImage, publishedAt } = req.body;
  const newsTitle = req.params.title;
  try {
      // Check if a news article with the same title already exists
      const existingNews = await News.findOne({ title: { $regex: new RegExp(newsTitle, 'i') } });
      if (existingNews) {
          return res.status(409).json({ error: 'News with the same title already exists' });
      }
      // Create a new news article
      const newNews = await News.create({ 
          title: newsTitle, 
          description, 
          url, 
          category, 
          summary,
          urlToImage,
          publishedAt
      });
      res.status(201).json(newNews);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Update an existing news article by title
router.put('/title/:title', async (req, res) => {
  const { description, url, category, summary, urlToImage, publishedAt } = req.body;
  const newsTitle = req.params.title;
  try {
      // Find the news article based on the title
      let news = await News.findOne({ title: { $regex: new RegExp(newsTitle, 'i') } });
      if (!news) {
          return res.status(404).json({ error: 'News not found' });
      }
      // Update the fields if they are provided in the request body
      if (description) news.description = description;
      if (url) news.url = url;
      if (category) news.category = category;
      if (summary) news.summary = summary;
      if (urlToImage) news.urlToImage = urlToImage;
      if (publishedAt) news.publishedAt = publishedAt;
      // Save the updated news article
      await news.save();
      res.json({ message: 'News updated successfully' });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Delete an existing news article by title
router.delete('/title/:title', async (req, res) => {
  const newsTitle = req.params.title;

  try {
      // Find and remove the news article based on the title
      const news = await News.findOneAndDelete({ title: { $regex: new RegExp(newsTitle, 'i') } });

      if (!news) {
          return res.status(404).json({ error: 'News not found' });
      }

      res.json({ message: 'News deleted successfully' });
  } catch (error) {
      console.error('Error:', error); // Log the error for debugging
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Get news articles by category
router.get('/category/:category', async (req, res) => {
  const category = req.params.category;

  try {
      // Find news articles based on the category
      const news = await News.find({ category: category });

      res.json(news);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get latest news articles
router.get('/latest', async (req, res) => {
  try {
      // Find and sort all news articles based on the publishedAt field in descending order
      const latestNews = await News.find().sort({ publishedAt: -1 }).limit(20);

      res.json(latestNews);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Add comment to a news article
router.post('/id/:id/comments', async (req, res) => {
  const newsId = req.params.id;
  const { text, username } = req.body;
  try {
    const news = await News.findById(newsId);

    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }

    // Add the comment to the news article along with the username
    news.comments.push({ text, username});
    await news.save();

    res.json({ message: 'Comment added successfully', news });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Retrieve comments for a news article
router.get('/id/:id/comments', async (req, res) => {
  const newsId = req.params.id;
  try {
    const news = await News.findById(newsId);

    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }

    const comments = news.comments || [];
    res.json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

