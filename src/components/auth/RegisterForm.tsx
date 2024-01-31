import { FormEventHandler, useState, useEffect } from "react";
import { useNavigate, Link} from "react-router-dom";

import useApi from "../../hooks/api/useApi";
import { 
validatePasswordLength, 
validateEmailFormat, 
validateGroupFormat, 
validateNameFormat, 
validatePhoneFormat, 
validateUsernameFormat 
} from "./validations";
import styles from "./Auth.module.css";

interface RoleSwitcherProps {
    selectedRole: string;
    setSelectedRole: React.Dispatch<React.SetStateAction<string>>;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({selectedRole, setSelectedRole}) => {
  
    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
    };

    return (
        <div className={styles.SwitcherContainer}>
          <label
            className={`${styles.SwitcherLabel} ${selectedRole === 'USER' && styles.selected}`}
            onClick={() => handleRoleChange('USER')}
          >
            User
          </label>

          <label
            className={`${styles.SwitcherLabel} ${selectedRole === 'MODERATOR' && styles.selected}`}
            onClick={() => handleRoleChange('MODERATOR')}
          >
            Moderator
          </label>
    
          <label
            className={`${styles.SwitcherLabel} ${selectedRole === 'ADMIN' && styles.selected}`}
            onClick={() => handleRoleChange('ADMIN')}
          >
            Admin
          </label>
        </div>
      );
};

const RegisterForm = () => {
    const { request, setError } = useApi();
    const navigate = useNavigate();

    const [wrongName, setWrongName] = useState(false);
    const [wrongUsername, setWrongUsername] = useState(false);
    const [wrongPhone, setWrongPhone] = useState(false);
    const [wrongEmail, setWrongEmail] = useState(false);
    const [wrongGroup, setWrongGroup] = useState(false);
    const [wrongPassword, setWrongPassword] = useState(false);
    const [showBadRequestAlert, setShowBadRequestAlert] = useState(false);
    const [showWrongFormatAlert, setShowWrongFormatAlert] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>('USER');

    useEffect(() => {
        if (showBadRequestAlert){
            const timer = setTimeout(() => {
                setShowBadRequestAlert(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showBadRequestAlert]);

    useEffect(() => {
        if (showWrongFormatAlert){
            const timer = setTimeout(() => {
                setShowWrongFormatAlert(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showWrongFormatAlert]);

    const registerHandler: FormEventHandler<HTMLFormElement> = async (event) => {
        const handleErrorResponse = (error: any) => {
            if (error.response.status != 400)
                return;
            const reUsername = /^username \[[a-zA-Z0-9_\.]{3,16}\] is already used$/;
            const reEmail = /^email \[[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\] is already used$/;
            const rePhone = /^phone_number \[\+\d{3}(\d{2})(\d{3})(\d{2})(\d{2})] is already used$/;
            if (reUsername.test(error.response.data.detail)) {
                setWrongUsername(true);
                setShowBadRequestAlert(true);
            }
            if (rePhone.test(error.response.data.detail)){
                setWrongPhone(true);
                setShowBadRequestAlert(true);
            }
            if (reEmail.test(error.response.data.detail)){
                setWrongEmail(true);
                setShowBadRequestAlert(true);
            }
        }

        event.preventDefault();

        const data = new FormData(event.currentTarget);

        if (!await validateInput(data))
            return;

        try {

            const endpoint = "/auth/singup";
            const params = {
            method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                data: {
                    name: data.get("name")?.toString().split(' ')[0],
                    surname: data.get("name")?.toString().split(' ')[1],
                    username: data.get("username"),
                    phone_number: data.get("phone"),
                    email: data.get("email"),
                    role: selectedRole,
                    password: data.get("password"),
                    group_name: data.get("group"),
                },
            };
            await request(endpoint, params, () => {navigate("/login")}, handleErrorResponse);
        } catch (error: any) {
            console.log(error)
            setError(error.message || error);
        }
    };

    const validateInput = async (data: FormData): Promise<boolean> => {
        let result = true;      
        if (!validateNameFormat(data.get("name")?.toString() || "")) {
            setWrongName(true);
            result = false;
        }
        if (!validateUsernameFormat(data.get("username")?.toString() || "")) {
            setWrongUsername(true);
            result = false;
        }
        if (!validatePhoneFormat(data.get("phone")?.toString() || "")) {
            setWrongPhone(true);
            result = false;
        }
        if (!validateEmailFormat(data.get("email")?.toString() || "")) {
            setWrongEmail(true);
            result = false;
        }
        if (!validateGroupFormat(data.get("group")?.toString() || "")) {
            setWrongGroup(true);
            result = false;
        }
        if (!validatePasswordLength(data.get("password")?.toString() || "")) {
            setWrongPassword(true);
            result = false;
        }
      
        if (!result) {
          setShowWrongFormatAlert(true);
        }
        return result;
    };

    return (
    <>
        {showBadRequestAlert && (
            <div className={styles.Alert}>
                {wrongUsername && <p>This username is already taken</p>}
                {wrongEmail && <p>This email is already used</p>}
                {wrongPhone && <p>This phone number is already used</p>}
            </div>
        )}
        {showWrongFormatAlert && (
            <div className={styles.Alert}>
                <p>It seems like some field in incorrect form</p>
            </div>
        )}
        <form onSubmit={registerHandler} className={styles.Form}>
            <div className={`${styles.Input} ${wrongName && styles.WrongInput}`}>
            <label htmlFor="name">Name</label>
            <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Full Name"
                onChange={()=>setWrongName(false)}
            />
            </div>
            <div className={`${styles.Input} ${wrongUsername && styles.WrongInput}`}>
            <label htmlFor="username">Username</label>
            <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Username"
                onChange={()=>setWrongUsername(false)}
            />
            </div>
            <div className={`${styles.Input} ${wrongPhone && styles.WrongInput}`}>
            <label htmlFor="phone">Phone</label>
            <input
                id="phone"
                name="phone"
                type="text"
                required
                placeholder="Phone number"
                onChange={()=>setWrongPhone(false)}
            />
            </div>
            <div className={`${styles.Input} ${wrongEmail && styles.WrongInput}`}>
            <label htmlFor="email">Email</label>
            <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email Address"
                onChange={()=>setWrongEmail(false)}
            />
            </div>
            <div className={`${styles.Input} ${wrongGroup && styles.WrongInput}`}>
            <label htmlFor="group">Group</label>
            <input
                id="group"
                name="group"
                type="text"
                required
                placeholder="Group name"
                onChange={()=>setWrongGroup(false)}
            />
            </div>
            <div className={`${styles.Input} ${wrongPassword && styles.WrongInput}`}>
            <label htmlFor="password">Password</label>
            <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                onChange={()=>setWrongPassword(false)}
            />
            </div>
            <RoleSwitcher selectedRole={selectedRole} setSelectedRole={setSelectedRole}/>
            <button type="submit">Submit</button>
            <Link className={styles.Link} to={"/auth/login"}>
            Sign in
            </Link>
        </form>
    </>
    );
};

export default RegisterForm;