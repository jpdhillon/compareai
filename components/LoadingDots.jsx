import styles from "../styles/loading-dots.module.css";

const LoadingDots = ({ color = "#000", style = "small" }) => {
  return (
    <span className={style === "small" ? styles.loading2 : styles.loading}>
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
      <span style={{ backgroundColor: color }} />
    </span>
  );
};

LoadingDots.defaultProps = {
  style: "small",
};

export default LoadingDots;
