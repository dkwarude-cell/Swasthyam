import { Droplet, Heart, Users, Trophy, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface AwarenessScreenProps {
  onStart: () => void;
  language: string;
}

export function AwarenessScreen({ onStart, language }: AwarenessScreenProps) {
  return (
    <div className="h-screen bg-gradient-to-br from-[#1b4a5a] to-[#2a5a6a] flex flex-col overflow-hidden">
      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-12 flex flex-col items-center justify-center">
        {/* Logo/Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-24 h-24 bg-[#fcaf56] rounded-3xl flex items-center justify-center mb-8 shadow-2xl"
        >
          <Droplet className="w-14 h-14 text-white" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white text-3xl text-center mb-4"
        >
          Welcome to SwasthTel
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-[#ffeedd] text-center mb-12 px-4"
        >
          Your journey to healthier oil consumption starts here
        </motion.p>

        {/* Feature Cards */}
        <div className="w-full max-w-sm space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-[#fcaf56] rounded-xl flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white">Smart Tracking</p>
              <p className="text-[#ffeedd] text-sm">Monitor your daily oil consumption</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-[#fcaf56] rounded-xl flex items-center justify-center flex-shrink-0">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white">AI Recommendations</p>
              <p className="text-[#ffeedd] text-sm">Personalized recipe optimization</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-[#fcaf56] rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white">Community Engagement</p>
              <p className="text-[#ffeedd] text-sm">Join India's health movement</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-[#fcaf56] rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white">Healthy Kitchen Verified</p>
              <p className="text-[#ffeedd] text-sm">Blockchain-verified restaurants</p>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 w-full max-w-sm"
        >
          <p className="text-[#fcaf56] text-center mb-2">National Goal</p>
          <p className="text-white text-center text-2xl mb-1">10% Oil Reduction</p>
          <p className="text-[#ffeedd] text-center text-sm">Join thousands in making India healthier</p>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="bg-white/10 backdrop-blur-sm px-6 py-6 border-t border-white/20">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          onClick={onStart}
          className="w-full py-4 bg-[#fcaf56] text-white rounded-xl shadow-lg hover:bg-[#f5a042] transition-colors"
        >
          Start Your Journey
        </motion.button>
      </div>
    </div>
  );
}
