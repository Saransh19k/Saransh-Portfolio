const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const About = sequelize.define('About', {
  data: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      heading: 'About Me',
      intro: "Passionate full-stack developer with a love for creating innovative solutions and pushing the boundaries of what's possible on the web.",
      whoIAm: {
        title: 'Who I Am',
        paragraphs: [
          "I'm Saransh Nimje, a passionate full-stack developer with a deep love for creating innovative digital solutions. My journey in technology began with a curiosity about how the web works, and it has evolved into a commitment to building scalable, user-centric applications that make a real impact.",
          "With expertise in modern web technologies like React, Node.js, TypeScript, and SQL databases, I specialize in creating robust full-stack applications that deliver exceptional user experiences. I believe in writing clean, maintainable code and staying current with the latest industry trends.",
          "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community. I'm always eager to learn and take on new challenges that push my skills forward.",
          "My approach combines technical excellence with creative problem-solving, ensuring that every project I work on is not only functional but also delivers an outstanding user experience that exceeds expectations."
        ]
      },
      skills: [
        { name: 'React', level: 90, color: '#61DAFB' },
        { name: 'Node.js', level: 85, color: '#339933' },
        { name: 'TypeScript', level: 80, color: '#3178C6' },
        { name: 'SQL/PostgreSQL', level: 75, color: '#336791' },
        { name: 'Python', level: 70, color: '#3776AB' },
        { name: 'AWS', level: 65, color: '#FF9900' }
      ],
      stats: [
        { label: 'Years Experience', value: '3+' },
        { label: 'Projects Completed', value: '50+' },
        { label: 'Happy Clients', value: '30+' },
        { label: 'Technologies', value: '20+' }
      ],
      experience: [
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
      ],
      education: [
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
      ]
    }
  }
});

module.exports = About; 