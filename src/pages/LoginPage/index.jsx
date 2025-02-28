import LoginForm from "./LoginForm"
import "./style.css"

const LoginPage = () => {
  return (
    <div className="login__page">
      <h1 className="DisplayL">LinguaTalk</h1>
      <LoginForm />
      <small className="BodyS">Team5</small>
    </div>
  )
}

export default LoginPage