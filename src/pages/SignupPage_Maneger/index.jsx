import SignupForm from "./SignupForm"
import "./style.css"

const SignupPage = () => {
  return (
    <div className="signup__page">
      <h1 className="DisplayL">LinguaTalk</h1>
      <h2 className="DisplayL">관리자 회원가입</h2>
      <SignupForm />
      <small className="BodyS">Team5</small>
    </div>
  )
}

export default SignupPage