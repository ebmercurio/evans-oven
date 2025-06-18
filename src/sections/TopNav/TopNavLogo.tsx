import logo from '../../assets/evansOven.png';

type TopNavLogoProps = {
  size: string;
};
function TopNavLogo(props: TopNavLogoProps) {
  const { size } = props;

  return (
    <img src={logo} alt="Site Logo" width={size === 'small' ? '50px' : '75px'} height={size === 'small' ? '50px' : '75px'} />
  );
}

export default TopNavLogo;
