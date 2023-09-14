import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

const propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    paragraph: PropTypes.string,
  }).isRequired,
  children: PropTypes.node,
  tag: PropTypes.oneOf(["h1", "h2", "h3"]),
  showImage: PropTypes.bool,
};

const defaultProps = {
  children: null,
  tag: "h2",
  showImage: false,
};

const SectionHeader = ({
  className,
  data,
  children,
  tag,
  showImage,
  ...props
}) => {
  const classes = classNames("section-header", className);

  const Component = tag;

  return (
    <>
      {(data.title || data.paragraph) && (
        <div {...props} className={classes}>
          <div className="container-xs">
            {showImage && (
              <div className="container-logo">
                <img
                  className="profile-photo"
                  src="./DCLULogo.png"
                  alt={"Carlie Anglemire"}
                />
              </div>
            )}
            {data.title && (
              <Component
                className={classNames(
                  "mt-0 text-color-primary",
                  data.paragraph ? "mb-16" : "mb-0"
                )}
              >
                {data.title}
              </Component>
            )}
            {data.paragraph && (
              <p className="m-0 text-color-primary">{data.paragraph}</p>
            )}
            <div>
              <br />
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

SectionHeader.propTypes = propTypes;
SectionHeader.defaultProps = defaultProps;

export default SectionHeader;
