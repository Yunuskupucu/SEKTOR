import { MapPin, DollarSign, Mail, User, Briefcase } from 'lucide-react';
import styles from '../../styles/JobCard.module.scss';
import { useTheme } from '../../context/useTheme';

const JobCard = () => {
  const { theme } = useTheme();

  const jobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'Acme',
      location: 'Remote',
      salary: '₺60-90K',
      contact: '@hr',
    },
    {
      id: 2,
      title: 'Backend Developer',
      company: 'Beta',
      location: 'İstanbul',
      salary: '₺80-120K',
      contact: 'jobs@example.com',
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'Gamma Tech',
      location: 'Ankara',
      salary: '₺70-110K',
      contact: 'career@gamma.com',
    },
  ];

  const themeClass = theme === 'dark' ? styles.dark : '';

  return (
    <div className={`${styles.jobCardContainer} ${themeClass}`}>
      <div className={styles.jobCardWrapper}>
        <div className={styles.jobCardsList}>
          {jobs.map((job) => (
            <div key={job.id} className={styles.jobCard}>
              <div className={styles.jobTitle}>
                <Briefcase size={20} />
                {job.title}
              </div>

              <div className={`${styles.infoItem} ${styles.company}`}>
                <User size={16} />
                <span>{job.company}</span>
              </div>
              <div className={styles.infoItem}>
                <MapPin size={16} />
                <span>{job.location}</span>
              </div>

              <div className={styles.jobSalary}>
                <DollarSign size={16} />
                {job.salary}
              </div>
              <div className={styles.jobContact}>
                <Mail size={16} />
                {job.contact}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
