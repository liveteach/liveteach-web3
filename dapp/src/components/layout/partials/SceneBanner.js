import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Image from '../../elements/Image';

const SceneBanner = ({
  className,
  ...props
}) => {

  const classes = classNames(
    'brand',
    className
  );

  return (
    <div
      {...props}
      className={classes}
    >
      <h1 className="m-0">
        <Link to="/">
          <Image
            src="scene-banner.jpg"
            alt="Open"
            width={1400}
            height={563} />
        </Link>
      </h1>
    </div>
  );
}

export default SceneBanner;