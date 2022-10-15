import { Link } from "react-router-dom";
import { HOME_ROUTE, IMAGE_GALLERY_ROUTE } from "@dictionaries/screens";
import styles from "./Nav.module.scss";

const items = [
  {
    route: HOME_ROUTE,
    text: "Home",
  },
  {
    route: IMAGE_GALLERY_ROUTE,
    text: "Image Gallery",
  },
];

export const Nav = () => {
  return (
    <nav>
      <ul className={styles.list}>
        {items.map((item) => (
          <li className={styles.item} key={item.route}>
            <Link to={item.route}>{item.text}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
