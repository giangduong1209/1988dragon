import { useColorModeValue } from '@chakra-ui/react';
import Link from 'next/link';
import { COLLECTIONS } from '../../../../constants/CollectionsData/collections';

const Home = () => {
  const color1 = useColorModeValue('#000', '#fff');

  return (
    <div className="metaportal_fn_collectionpage">
      <div className="container">
        <div className="metaportal_fn_collection">
          <div className="metaportal_fn_clist">
            <div className="metaportal_fn_result_list">
              <div className="metaportal_fn_drops">
                <ul className="grid">
                  {COLLECTIONS &&
                    COLLECTIONS.map((collection, i) => (
                      <li className={`${collection.type} ${collection.special} ${collection.clothing}`} key={i}>
                        <div className="nft__item">
                          <div className="img_holder">
                            <img src={collection.image} alt="" />
                            <Link href={`/${collection.link}`}>
                              <a className="full_link" />
                            </Link>
                          </div>
                          <div className="title_holder">
                            <h3 style={{ color: `${color1}` }} className="fn_title">
                              <Link href={`/${collection.link}`}>{collection.title}</Link>
                            </h3>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            {/* !Result List */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
