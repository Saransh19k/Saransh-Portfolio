import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { aboutAPI } from '../utils/api';

const About: React.FC = () => {
  const [aboutContent, setAboutContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const skills = [
    { name: 'React', level: 90, color: '#61DAFB' },
    { name: 'Node.js', level: 85, color: '#339933' },
    { name: 'TypeScript', level: 80, color: '#3178C6' },
    { name: 'SQLite', level: 75, color: '#003B57' },
    { name: 'Python', level: 70, color: '#3776AB' },
    { name: 'AWS', level: 65, color: '#FF9900' },
  ];

  const experience = [
    {
      year: '2025 - Present',
      title: 'B.Tech Student & Tech Enthusiast',
      company: 'Baderia Global Institute of Engineering and Management',
      description: 'Currently pursuing B.Tech in CSE (IoT & Cyber Security, including Blockchain Technology). Actively participating in coding clubs, technical workshops, and student-led tech initiatives.'
    },
    {
      year: '2024 - 2025',
      title: 'Personal Portfolio Project',
      company: 'Self-Driven',
      description: 'Designed and developed a personal portfolio website using React, Node.js, and TypeScript to showcase projects and skills.'
    },
    {
      year: '2023 - 2024',
      title: 'Open Source Contributor',
      company: 'GitHub',
      description: 'Contributed to open-source projects, focusing on bug fixes and feature enhancements in web development repositories.'
    },
    {
      year: '2022 - 2023',
      title: 'School Coding Club Member',
      company: 'ADITYA CONVENT SR. SEC. SCHOOL',
      description: 'Participated in school-level coding competitions and collaborated on group projects, building foundational programming skills.'
    }
  ];

  const education = [
    {
      year: '2025 - Present',
      degree: 'B.Tech in CSE (IoT & Cyber Security, including Blockchain Technology)',
      school: 'Baderia Global Institute of Engineering and Management, Jabalpur (RGPV Bhopal)',
      description: 'Currently in 1st year, 1st semester. Started college journey in 2025.'
    },
    {
      year: '2024 - 25',
      degree: 'Class 12th (CBSE)',
      school: 'ADITYA CONVENT SR. SEC. SCHOOL, JABALPUR',
      description: 'Completed Class 12th from CBSE board.'
    },
    {
      year: '2022 - 23',
      degree: 'Class 10th (CBSE)',
      school: 'ADITYA CONVENT SR. SEC. SCHOOL, JABALPUR',
      description: 'Completed Class 10th from CBSE board.'
    }
  ];

  useEffect(() => {
    aboutAPI.getAbout().then(res => {
      if (res.success) setAboutContent(res.data.content);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="gradient-text">Me</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            {loading ? 'Loading...' : aboutContent || 'Passionate full-stack developer with a love for creating innovative solutions and pushing the boundaries of what\'s possible on the web.'}
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-6">Who I Am</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                I'm Saransh Nimje, a passionate full-stack developer with a deep love for 
                creating innovative digital solutions. My journey in technology began with 
                a curiosity about how the web works, and it has evolved into a commitment 
                to building scalable, user-centric applications that make a real impact.
              </p>
              <p>
                With expertise in modern web technologies like React, Node.js, TypeScript, 
                and SQL databases, I specialize in creating robust full-stack applications 
                that deliver exceptional user experiences. I believe in writing clean, 
                maintainable code and staying current with the latest industry trends.
              </p>
              <p>
                When I'm not coding, you'll find me exploring new technologies, contributing 
                to open-source projects, or sharing knowledge with the developer community. 
                I'm always eager to learn and take on new challenges that push my skills forward.
              </p>
              <p>
                My approach combines technical excellence with creative problem-solving, 
                ensuring that every project I work on is not only functional but also 
                delivers an outstanding user experience that exceeds expectations.
              </p>
            </div>

            {/* Personal Stats */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              {[
                { label: 'Years Experience', value: '3+' },
                { label: 'Projects Completed', value: '50+' },
                { label: 'Happy Clients', value: '30+' },
                { label: 'Technologies', value: '20+' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="text-center p-4 bg-gray-800 rounded-lg"
                >
                  <div className="text-2xl font-bold gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-6">Skills & Technologies</h2>
            <div className="space-y-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-medium">{skill.name}</span>
                    <span className="text-gray-400 text-sm">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      className="h-2 rounded-full"
                      style={{ backgroundColor: skill.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Experience Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Experience</h2>
          <div className="space-y-8">
            {experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
                className={`flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col gap-8 items-center`}
              >
                <div className="flex-1">
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <div className="text-indigo-400 font-medium mb-2">{exp.year}</div>
                    <h3 className="text-xl font-bold mb-2">{exp.title}</h3>
                    <div className="text-indigo-300 mb-3">{exp.company}</div>
                    <p className="text-gray-300">{exp.description}</p>
                  </div>
                </div>
                <div className="w-4 h-4 bg-indigo-500 rounded-full relative">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-20"></div>
                </div>
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                className="bg-gray-800 p-6 rounded-lg"
              >
                <div className="text-indigo-400 font-medium mb-2">{edu.year}</div>
                <h3 className="text-xl font-bold mb-2">{edu.degree}</h3>
                <div className="text-indigo-300 mb-3">{edu.school}</div>
                <p className="text-gray-300">{edu.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About; 