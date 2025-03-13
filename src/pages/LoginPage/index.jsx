import LoginForm from "./LoginForm"
import "./style.css"

const LoginPage = () => {
  return (
    <div className="login__page">
      <div className="logo-group">
        <img src={process.env.PUBLIC_URL + "/logo.png"} alt="LinguaTalk Logo" className="logo" />
        <h1 className="logo_text DisplayL">LinguaTalk</h1>
      </div>
      <LoginForm />
    </div>
  )
}

export default LoginPage