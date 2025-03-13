import SignupForm from "./SignupForm"
import "./style.css"

const SignupPage = () => {
  return (
    <div className="signup__page">
      <div className="logo-group">
        <img src={process.env.PUBLIC_URL + "/logo.png"} alt="LinguaTalk Logo" className="logo" />
        <h1 className="logo_text DisplayL">LinguaTalk</h1>
      </div>
      <h2 className="DisplayL">관리자 회원가입</h2>
      <SignupForm />
    </div>
  )
}

export default SignupPage