import React from 'react';
import { Newspaper, Calendar, Clock, ArrowRight } from 'lucide-react';
import { LATEST_NEWS } from '../data/siteContent';

export const LatestNews: React.FC = () => {
  return (
    <section id="latest-news" className="py-16 sm:py-20 border-t border-white/10 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff4d55]">
              Global Updates & Press
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
              Latest News
            </h2>
            <p className="mt-2 text-neutral-400 text-sm sm:text-base">
              Explore key milestones, international talent stories, and company press releases.
            </p>
          </div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {LATEST_NEWS.map((item) => (
            <article
              key={item.id}
              className="group flex flex-col rounded-3xl border border-white/10 bg-[#16161c] overflow-hidden shadow-xl transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
            >
              {/* News Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3">
                  <span className="rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white border border-white/10">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* News Body */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center space-x-3 text-xs text-neutral-400 mb-3">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                      <span>{item.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5 text-neutral-500" />
                      <span>{item.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white leading-snug group-hover:text-[#ff4d55] transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {item.snippet}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#ff5c63] group-hover:text-white transition-colors flex items-center space-x-1">
                    <span>Read Full Story</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
