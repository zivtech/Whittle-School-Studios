import React from 'react';

import Title from '../components/global/title';
import MainImage from '../components/global/main-image';

import BodyText from '../content-modules/global/body-text';

import { PAGE_TYPE } from '../constants/settings';

import largeImage from '../test-content/images/article-large.jpg';
import mediumImage from '../test-content/images/article-medium.jpg';
import smallImage from '../test-content/images/article-small.jpg';

import styles from './modules.module.css';

const Article = () => (
  <div className={styles.moduleWrapper}>
    <div className={styles.component}>
      <Title
        text="Promoting Economic & Cultural Diversity Across Our Campuses"
        type={PAGE_TYPE.ARTICLE}
      />
      <BodyText
        content={{
          markdown: `Favoring our work is the emergence of a new educational canon thanks, in large part, to the di cult, pioneering e orts of so many change agents who have gone before us. We stand on their shoulders. They taught us that a modern school is one that thinks as much about learning as teaching; knows that how one learns will outlast what one learns; hopes to bring about the end of lock-step, one-size- ts-all education; understands that the emotional development of its students must also be given time; intuits that the physical design of a facility is a lesson unto itself; believes that a well- designed system of schools will surpass a single one; harnesses the horses of our new digital age; appreciates that education can no longer be bound by local or national jurisdictions; and works to make social responsibility much more than its scholarship program.

Favoring our work is the emergence of a new educational canon thanks, in large part, to the di cult, pioneering e orts of so many change agents who have gone before us. We stand on their shoulders. They taught us that a modern school is one that thinks as much about learning as teaching; knows that how one learns will outlast what one learns; hopes to bring about the end of lock-step, one-size- ts-all education; understands that the emotional development of its students must also be given time; intuits that the physical design of a facility is a lesson unto itself; believes that a well- designed system of schools will surpass a single one; harnesses the horses of our new digital age; appreciates that education can no longer be bound by local or national jurisdictions; and works to make social responsibility much more than its scholarship program.

Favoring our work is the emergence of a new educational canon thanks, in large part, to the di cult, pioneering e orts of so many change agents who have gone before us. We stand on their shoulders. They taught us that a modern school is one that thinks as much about learning as teaching; knows that how one learns will outlast what one learns; hopes to bring about the end of lock-step, one-size- ts-all education; understands that the emotional development of its students must also be given time; intuits that the physical design of a facility is a lesson unto itself; believes that a well- designed system of schools will surpass a single one; harnesses the horses of our new digital age; appreciates that education can no longer be bound by local or national jurisdictions; and works to make social responsibility much more than its scholarship program.
          `,
        }}
        isFirstModule
      />
    </div>
    <div className={styles.component}>
      <MainImage
        alt="Picture preview"
        image={{
          small: smallImage,
          medium: mediumImage,
          large: largeImage,
        }}
        headline="Someone with his head in the clouds & feet on the ground."
        subhead="If it is essential for a school to understand well what it wants to help its students achieve, it is equally important for a school to know how it can deliver those results."
        type={PAGE_TYPE.ARTICLE}
      />
    </div>
    <div className={styles.component}>
      <MainImage
        alt="Picture preview"
        image={{
          small: smallImage,
          medium: mediumImage,
          large: largeImage,
        }}
        headline="Promoting Economic & Cultural Diversity Across Our Campuses"
        type={PAGE_TYPE.ARTICLE}
      />
    </div>
  </div>
);

export default Article;