"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Comment  from "@/app/components/layout/Comment";

interface NewsPage {
  title: string;
  description: string;
  author: string;
  url: string;
  _id: string;
  category: string;
  content: string;
  summary: string;
  urlToImage: string | null;
  publishedAt: Date;
}

export default function Id({ params }: any) {
  const [newsInfo, setNewsInfo] = useState<NewsPage | null>(null);

  useEffect(() => {
    // Fetch news for the specified newsid
    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/news/id/${params.id}`
        );
        //console.log('data:',response.data);
        setNewsInfo(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchNews();
    //console.log(newsId, 'rrr');
  }, [params.id]);

  useEffect(() => {
    console.log(newsInfo);
  }, [newsInfo]);

  return (
    <div>
      <div>
        <h5 className="mb-4 mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {newsInfo?.title}
        </h5>
        <img
          className="pt-4 w-full h-62 rounded-t-lg "
          src={newsInfo?.urlToImage}
          alt=""
        />
        <p className="pt-4 mb-3 mt-3 font-normal text-gray-700 dark:text-gray-400">
          {newsInfo?.summary}
        </p>
      </div>
      <Comment id={params.id} />
    </div>
  );
}
