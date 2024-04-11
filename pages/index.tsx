import { Default } from 'components/layouts/Default';
import { PageBanner } from 'components/layouts/PageBanner';
import { Home } from 'components/templates/home';
import type { NextPage } from 'next';

const HomePage: NextPage = () => {
  return (
    <Default pageName="Home">
      <PageBanner pageName={'Collection'} />
      <Home />
    </Default>
  );
};

export default HomePage;
