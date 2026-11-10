"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart, Tag, Coffee, Shirt, Compass } from "lucide-react";

interface StoryItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  gradient: string;
  badge?: string;
  action: () => void;
}

interface StoriesBarProps {
  onSelectCategory: (cat: string) => void;
  onFilterUnder50: () => void;
  onOpenLocation: () => void;
  onOpenFavorites: () => void;
  favoritesCount: number;
}

export function StoriesBar({
  onSelectCategory,
  onFilterUnder50,
  onOpenLocation,
  onOpenFavorites,
  favoritesCount
}: StoriesBarProps) {
  const stories: StoryItem[] = [
    {
      id: "favs",
      title: "Meus Favoritos",
      icon: <Heart className={`w-5 h-5 ${favoritesCount > 0 ? "fill-rose-500 text-rose-500" : "text-white"}`} />,
      gradient: "from-rose-500 via-pink-500 to-red-500",
      badge: favoritesCount > 0 ? `${favoritesCount}` : undefined,
      action: onOpenFavorites
    },
    {
      id: "under50",
      title: "Até R$ 50",
      icon: <Tag className="w-5 h-5 text-white" />,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      badge: "Oferta",
      action: onFilterUnder50
    },
    {
      id: "vintage",
      title: "Raridades 90s",
      icon: <Sparkles className="w-5 h-5 text-white" />,
      gradient: "from-amber-500 via-orange-500 to-rose-500",
      action: () => onSelectCategory("vintage")
    },
    {
      id: "feminino",
      title: "Feminino",
      icon: <Shirt className="w-5 h-5 text-white" />,
      gradient: "from-purple-500 via-fuchsia-500 to-pink-500",
      action: () => onSelectCategory("feminino")
    },
    {
      id: "masculino",
      title: "Masculino",
      icon: <Shirt className="w-5 h-5 text-white" />,
      gradient: "from-blue-500 via-indigo-500 to-cyan-500",
      action: () => onSelectCategory("masculino")
    },
    {
      id: "loja",
      title: "Nossa Loja",
      icon: <Coffee className="w-5 h-5 text-white" />,
      gradient: "from-amber-600 to-stone-600",
      action: onOpenLocation
    }
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-4 sm:py-6 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4 sm:gap-6 min-w-max justify-start sm:justify-center">
        {stories.map((story) => (
          <motion.button
            key={story.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={story.action}
            className="flex flex-col items-center gap-2 group focus:outline-none"
          >
            <div className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-rose-500 via-amber-400 to-pink-600 shadow-md group-hover:shadow-rose-500/20 transition-all">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr ${story.gradient} flex items-center justify-center p-3 text-white transition-transform duration-300 group-hover:scale-95`}>
                {story.icon}
              </div>
              {story.badge && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white border-2 border-white dark:border-zinc-900 shadow-sm animate-pulse">
                  {story.badge}
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              {story.title}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
