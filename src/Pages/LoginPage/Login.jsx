import { useState, useCallback, useEffect } from "react";
// import LoadingSpinner from "../../components/Common/Spinner";
import image from "../../assets/LOGO-CNAM.png";
import useResponse from "../../helper";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../utils/constants";
import { toast } from "react-toastify";
import { Box, CircularProgress,Button } from "@mui/material";
// import axios from "../../api/axios";
import axios from "axios";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
const Login = () => {
  const navigate = useNavigate();
  // const { LoginApi } = useResponse();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t} = useTranslation();
  const [code, setCode] = useState("en");

  const [isValid, setValid] = useState(false);

  const validate = useCallback(() => {
    return mobile.length;
  }, [mobile.length]);

  useEffect(() => {
    if (mobile.length === 9) {
      const isValid = validate();
      setValid(isValid);
    }
  }, [mobile.length, validate]);

  const handleNumber = e => {
    if (!e.target.validity.patternMismatch) {
      setMobile(e.target.value);
    }
  };

  // const HandelSubmit = useCallback( ()=>{
    
  //   navigate(PATHS.dashboard);

  // },[])

  useEffect(() => {
    axios.defaults.headers.common.authorization = "";
    sessionStorage.clear();
  }, []);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // useEffect(() => {
    
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setLatitude(position.coords.latitude);
  //         setLongitude(position.coords.longitude);
  //       //   console.log(position.coords.latitude);
  //       //   console.log(position.coords.longitude);
  //       },
  //       (error) => {
  //         console.error(error);
  //       }
  //     );
  //   } else {
  //     console.error("Geolocation is not supported by this browser.");
  //   }
  // }, []);
  const [coordinates, setCoordinates] = useState({latitude:'',longitude:''});
  useEffect(() => {
    axios
      .get("https://ipapi.co/json/")
      .then((response) => {
        const { latitude, longitude } = response?.data;
        setCoordinates({ latitude:latitude, longitude:longitude });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const HandelSubmit = useCallback(
    async e => {
      e.preventDefault();
      if (!mobile.length) {
        toast.error(`Please enter  Mobile Number`);
      } 
      else if (!password?.length) {
        toast.error(`Please enter Password`);
      } 
      // else if (mobile.length < 9) {
      //   toast.error(`Please enter valid Mobile Number`);
      // } 
      else if (mobile.length) {
        sessionStorage?.setItem('mobile',mobile)
        sessionStorage?.setItem('password',password)
        setIsLoading(true);
        axios?.post('/api/auth/token',
                {
                    mobileNumber:`+225${mobile}`,
                    password:password,
                    "deviceId": "ba6528dfbf8745968f457756ee732891",
                    "model": "Google Pixel 7",
                    "operatingSystem": "WINDOWS",
                    "networkConnectionMode": "ETHERNET",
                    "location": {
                      "latitude": coordinates?.latitude || 0,
                      "longitude": coordinates?.longitude || 0
                      }

                })
          .then(res => {
            const data = JSON.stringify(res.data)
            const acces = sessionStorage?.setItem('accesst',res.data.data.accessToken)
            const response = sessionStorage?.setItem('login',data)
            if(res.data.data?.accessToken?.length){
              navigate('/dashboard')
            }
            else if(res.data.data?.otpRequired===true){
              setIsLoading(false);
              navigate('/otp/verify')
            const response = sessionStorage?.setItem('otp',data)
              // return toast.error("OTP required");
            }
          })
          .catch((err) => {
            // setMobile("");
            // setPassword("");
            // console.log(err)
            setIsLoading(false);
            // if(err.response.data.data.code==='E401-51-002'){
              toast.error(`${err.response.data.data.message}`);
              setMobile('')
              setPassword('')
            // }
           
            // return toast.error("Number Entered is Incorrect");
          });
      }
    },
    [ mobile, navigate,password],
  );
// axios.get('https://maps.googleapis.com/maps/api/mapsjs/gen_204?csp_test=true')
  return (
    <>
      <div
        className='d-flex justify-content-center align-items-center'
        id='contentContainer'
      >
        {/* <div id='containerLeft'>
          <h2 id='regTextTwo'>Bank 24/7 with our virtual banking</h2>
          <p id='regType'>Discover more ways to bank than ever</p>
        </div> */}
        
        <div id='containerRight'>

        <Button
        onClick={() => {
          i18next.changeLanguage("en");
          setCode("en");
        }}
        style={code === "fr" ? { display: "block",marginLeft:'80%',marginTop:'-3%' } : { display: "none",marginLeft:'80%',marginTop:'-3%' }}
        variant='contained'
      >
        En
      </Button>
      <Button
        onClick={() => {
          i18next.changeLanguage("fr");
          setCode("fr");
        }}
        style={code === "en" ? { display: "block",marginLeft:'80%',marginTop:'-3%' } : { display: "none",marginLeft:'80%',marginTop:'-3%' }}
        variant='contained'
      >
        Fr
      </Button>
       
          {isLoading ? (
            <Box sx={{ margin: "45%", marginLeft: "42%" }}>
              <CircularProgress color='primary' />
            </Box>
          ) : (
            <>
              <center>
                <img src={image} id='logoImg' alt='' />
              </center>
              <br />
              <p >{t('mobile_number')}</p>
              <form>
                <div className='input-group'>
                  <input
                    type='text'
                    style={{ height: "50px",border:'1px solid black'}}
                    required
                    className='form-control w-75'
                    placeholder='Enter Mobile Number'
                    value={mobile}
                    pattern='^[0-9]*$'
                    onChange={handleNumber}
                    maxLength={9}
                  />
                </div>

                <br />
                <div >
                  <p>{t('password')}</p>

                  <input
                    type='password'
                    style={{ height: "50px",border:'1px solid black' }}
                    required
                    className='form-control '
                    placeholder='Enter Password'
                    value={password}
                    // pattern='^[0-9]*$'
                    onChange={(e)=>{
                      setPassword(e.target.value)
                    }}
                    // maxLength={9}
                  />

                </div>

                <p id='fpssword'>{t('forgot')}</p>

                <input
                  type='submit'
                  className=' btn btn-success w-100 mt-4 rounded'
                  variant='success'
                  value={t('submit')}
                  onClick={HandelSubmit}
                  // disabled={!isValid}
                />
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
