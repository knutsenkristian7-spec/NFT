import React from 'react';
import { motion } from 'motion/react';
import { Users, Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Digital Artist',
    avatar: 'https://images.unsplash.com/photo-1724435811349-32d27f4d5806?w=100',
    content: 'This platform has revolutionized how I showcase and sell my digital art. The community is incredible!',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'NFT Collector',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100',
    content: 'Best NFT marketplace I\'ve used. The auction system is smooth and the variety of art is amazing.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Crypto Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100',
    content: 'Love the user experience and the security features. Made my first NFT purchase here and couldn\'t be happier!',
    rating: 5,
  },
  {
    name: 'David Kim',
    role: '3D Artist',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100',
    content: 'The perfect platform for creators. Easy to mint, list, and sell. Highly recommend!',
    rating: 5,
  },
];

export const Community = () => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-blue-900/20 to-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full mb-4 border border-blue-500/30">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 text-sm">What Our Users Say</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Community Testimonials
          </h2>
          <p className="text-gray-400 text-lg">
            Trusted by thousands of creators and collectors worldwide
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-gray-800/50 to-blue-900/30 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20 shadow-xl hover:shadow-blue-500/20 transition-all"
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="w-8 h-8 text-blue-400 opacity-50" />
              </div>

              {/* Content */}
              <p className="text-gray-300 mb-4 line-clamp-4">{testimonial.content}</p>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30"
                />
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Active Users', value: '50K+', gradient: 'from-purple-400 to-pink-400' },
            { label: 'NFTs Created', value: '100K+', gradient: 'from-blue-400 to-cyan-400' },
            { label: 'Total Sales', value: '$10M+', gradient: 'from-green-400 to-emerald-400' },
            { label: 'Artists', value: '5K+', gradient: 'from-orange-400 to-red-400' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 text-center"
            >
              <div className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
