import moment from 'moment';
import React from 'react';
import Link from 'next/link';
import styles from './Card.module.scss';
import { UserDots } from '../UserDots';
import { VsmProject } from '../../interfaces/VsmProject';

export function VSMCard(props: { vsm: VsmProject }): JSX.Element {
  const { userIdentity: createdBy } = props.vsm.created;
  return (
    <Link
      href={`/projects/${props.vsm.vsmProjectID}`}
    >
      <div
        className={styles.card}
      >
        <div style={{ flex: 1, margin: 16 }}>
          <h1 className={styles.vsmTitle}>{props.vsm.name}</h1>
        </div>
        <div>
          <hr style={{ opacity: 0.1 }} />
          <div
            className={styles.bottomSection}
          >
            {/*Todo: Hide edited if no date*/}
            {!!props.vsm.lastUpdated &&
            <p className={styles.vsmLabel}>
              Edited {moment(props.vsm.lastUpdated.changeDate).fromNow()}
            </p>
            }
            {/*Todo: Show users who are relevant for each VSMCard instead of current user*/}
            {createdBy && <UserDots users={[`${createdBy}`]} />}
          </div>
        </div>

      </div>
    </Link>
  );
}
