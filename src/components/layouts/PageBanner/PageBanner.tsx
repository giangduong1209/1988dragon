import { useColorModeValue } from '@chakra-ui/react';
import React, { FC, Fragment } from 'react';

const PageBanner: FC<{ pageName: string }> = ({ pageName }) => {
  const color1 = useColorModeValue('#000', '#fff');
  const bg = useColorModeValue('rgb(143 143 143)', '#222222');

  return (
    <Fragment>
      <div className="metaportal_fn_pagetitle">
        <div className="container small">
          <div className="pagetitle">
            <h3 style={{ color: `${color1}` }} className="fn__maintitle big" data-text={pageName} data-align="center">
              {pageName}
            </h3>
          </div>
        </div>
      </div>{' '}
      <div style={{ background: `${bg}` }} className="fn_cs_section_divider">
        <div className="divider">
          <span className="short" />
          <span className="long" />
          <span className="short" />
        </div>
      </div>
    </Fragment>
  );
};

export default PageBanner;
