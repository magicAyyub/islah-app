import { FC, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import { Button } from "@/components/ui/button"

interface NoDataProps {
  message: string;
  onRetry?: () => void;
}

const NoData: FC<NoDataProps> = ({ message, onRetry }) => {
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimation()

  const handleHover = () => {
    setIsHovered(!isHovered)
    controls.start(isHovered ? "rest" : "hover")
  }

  const svgVariants = {
    rest: { rotate: 0 },
    hover: { rotate: 5, transition: { yoyo: Infinity, duration: 0.3 } }
  }

  const pathVariants = {
    rest: { pathLength: 0 },
    hover: { pathLength: 1, transition: { duration: 2, ease: "easeInOut" } }
  }

  const messageVariants = {
    rest: { y: 0 },
    hover: { y: -10, transition: { yoyo: Infinity, duration: 0.5 } }
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg shadow-inner"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center"
        onHoverStart={handleHover}
        onHoverEnd={handleHover}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="150"
          height="150"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={svgVariants}
          animate={controls}
          className="mb-6 text-primary"
        >
          <motion.circle cx="12" cy="12" r="10" variants={pathVariants} />
          <motion.line x1="12" y1="8" x2="12" y2="12" variants={pathVariants} />
          <motion.line x1="12" y1="16" x2="12.01" y2="16" variants={pathVariants} />
        </motion.svg>
        <motion.h2
          className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
          variants={messageVariants}
          animate={controls}
        >
          Oups ! Pas de données ici
        </motion.h2>
        <motion.p
          className="text-lg text-gray-600 mb-6"
          variants={messageVariants}
          animate={controls}
        >
          {message}
        </motion.p>
        {onRetry && (
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Réessayer
          </Button>
        )}
      </motion.div>
    </motion.div>
  )
}

export default NoData

