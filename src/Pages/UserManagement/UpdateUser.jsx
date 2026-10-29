import { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
// import axios from "../../api/axios";
import axios from "axios";
import { toast } from "react-toastify";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import useLocalStorage from "../../hooks/useLocalStorage";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Box,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  CardContent,
  Card,
  useTheme,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Grid,
  useMediaQuery,
  CircularProgress,
  Tooltip,
  Fade,
} from "@mui/material";
import useResponse from "../../helper";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";

import { useNavigate } from "react-router-dom";
import { PATHS } from "../../utils/constants";

const roles = [
  "AGENT",
  "SELF_KYC_CLIENT",
  "LEVEL_ONE_ADJUDICATOR",
  "LEVEL_TWO_ADJUDICATOR",
  "USER_MANAGER",
  "LEVEL_ONE_BRANCH_ADJUDICATOR",
  "LEVEL_TWO_BRANCH_ADJUDICATOR",
];

const reportingRoles = [
  "DISTRICT_REPORT_VIEWER",
  "GLOBAL_REPORT_VIEWER",
  "BRANCH_REPORT_VIEWER",
  "NONE",
];

const UpdateUser = () => {
  const { UpdateUserApi, getSingleUser } = useResponse();
const login = JSON.parse(sessionStorage?.getItem('login'))
  //const { accessToken } = JSON.parse(sessionStorage.getItem("jwtWithDetails"));
  // const [
  //   { accessToken, reportingRoleName, branchId, branchDistrict, roleName },
  // ] = useLocalStorage("jwtWithDetails");
  const navigate = useNavigate();
  const params = useParams();
  const theme = useTheme();
  const { enrolmentId,approvalRequired,approvalStatus } = params;
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  // const userMobileNumber = userNumber.slice(4, 14);
  const [mobilenumber, setMobilenumber] = useState('');
  const [values, setValues] = useState({
    personalDetails:{},
    birthDetails:{},
    address:{},
    contactDetails:{},
    professionalDetails:{},
    subscriptionDetails:{}
  });
  const [values1, setvalues1] = useState({
    personalDetails:{},
    birthDetails:{},
    address:{},
    contactDetails:{},
    professionalDetails:{},
    subscriptionDetails:{}
  });
  const [value, setValue] = useState({
    personalDetails:{},
    birthDetails:{},
    address:{},
    contactDetails:{},
    professionalDetails:{},
    subscriptionDetails:{}
  });
  const [value1, setValue1] = useState({
    personalDetails:{},
    birthDetails:{},
    address:{},
    contactDetails:{},
    professionalDetails:{},
    subscriptionDetails:{}
  });
  const [checked, setChecked] = useState(false);
  // const fun1 = useCallback(() => {
  //   if (reportingRole.includes("REPORT_VIEWER")) {
  //     return true;
  //   }
  // }, [reportingRole]);
  // const [reportingRoleChecked, setReportingRoleChecked] = useState(false);
  // const [roless, setRole] = useState(`${values.role}`);

  const [branchlist, setBranchlist] = useState([]);

  const [password, setPassword] = useState("");

  const Password = btoa(password);
  const [loading,setLoading] = useState(false)
  

  // useEffect(() => {
  //   setReportingRoleChecked(fun1());
  // }, [fun1]);

  const handleChange = useCallback(() => {
    setChecked(prev => !prev);
  }, []);
  // const handleReportingRoleToggle = useCallback(() => {
  //   setReportingRoleChecked(prev => !prev);
  //   console.log("fun1()", fun1());

  //   // alert(reportingRoleChecked)
  // }, [fun1]);
   useEffect(() => {
    if(approvalRequired==='true' && approvalStatus==='null'){
      axios.get(`/api/management/enrolment/${enrolmentId}/dedupe-matches`,
     {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${login?.data?.accessToken}`,
      },
    }
    ).then( async (res) => {
      if (!res) {
        // alert("SINGLE ERROR");
      } else {
        setValues(res?.data?.data?.matches?.[0]?.enrolmentDetails);
        setvalues1(res?.data?.data?.matches?.[1]?.enrolmentDetails);
      }
    }).catch(err=>{
      toast.error(`${err.response.data.error.message}`);
      navigate('/enrollments')
    });
    }
    else{
      axios.get(`/api/management/enrolment/${enrolmentId}/completed`,
     {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${login?.data?.accessToken}`,
      },
    }
    ).then( async (res) => {
      if (!res) {
        // alert("SINGLE ERROR");
      } else {
        setValues(res?.data?.data?.enrolment?.enrolmentDetails);
        // setvalues1(res?.data?.data?.enrolmentDetails);
      }
    }).catch(err=>{
      toast.error(`${err.response.data.error.message}`);
      navigate('/enrollments')
    });
    }
  }, []);

useEffect(()=>{
    // console.log(values)
    setValue(
      {
        "personalDetails": {
        "titleCode": values?.personalDetails?.title?.code,
        "firstNames": values?.personalDetails?.firstNames,
        "lastName": values?.personalDetails?.lastName,
        "currentNationalityCode": values?.personalDetails?.currentNationality?.code,
        "maritalStatusCode": values?.personalDetails?.maritalStatus?.code,
        "maidenName": values?.personalDetails?.maidenName
        },
        "birthDetails": {
        "date": values?.birthDetails?.date,
        "certificateNumber": values?.birthDetails?.certificateNumber,
        "certificateIssueDate": values?.birthDetails?.certificateIssueDate,
        "countryCode": values?.birthDetails?.country?.code,
        "subPrefectureCode": values?.birthDetails?.subPrefecture?.code
        },
        "address": {
        "subPrefectureCode": values?.address?.subPrefecture?.code,
        "agencyCode": values?.address?.agency?.code
        },
        "contactDetails": {
        "mobileNumber": values?.contactDetails?.mobileNumber,
        "landlineNumber": values?.contactDetails?.landlineNumber,
        "email": values?.contactDetails?.email,
        "postOfficeBox": values?.contactDetails?.postOfficeBox
        },
        "professionalDetails": {
        "personTypeCode": values?.professionalDetails?.personCategory?.code,
        "professionCode": values?.professionalDetails?.profession?.code,
        "employerCompanyCode": values?.professionalDetails?.employer?.code,
        "registrationNumberTypeCode": values?.professionalDetails?.registrationNumberTypeCode,
        "registrationNumber": values?.professionalDetails?.registrationNumber,
        },
        "subscriptionDetails": {
        "paidByCode": values?.subscriptionDetails?.paidBy?.code,
        "payer": {
        "cnamNumber": values?.subscriptionDetails?.payer?.cnamNumber,
        "enrolmentId": values?.subscriptionDetails?.payer?.enrolmentId,
        "firstName": values?.subscriptionDetails?.payer?.firstName,
        "lastName": values?.subscriptionDetails?.payer?.lastName
        }
        }
       }
    )
    // console.log(value)
},[values])
useEffect(()=>{
    // console.log(values)
    setValue1(
      {
        "personalDetails": {
        "titleCode": values1?.personalDetails?.title?.code,
        "firstNames": values1?.personalDetails?.firstNames,
        "lastName": values1?.personalDetails?.lastName,
        "currentNationalityCode": values1?.personalDetails?.currentNationality?.code,
        "maritalStatusCode": values1?.personalDetails?.maritalStatus?.code,
        "maidenName": values1?.personalDetails?.maidenName
        },
        "birthDetails": {
        "date": values1?.birthDetails?.date,
        "certificateNumber": values1?.birthDetails?.certificateNumber,
        "certificateIssueDate": values1?.birthDetails?.certificateIssueDate,
        "countryCode": values1?.birthDetails?.country?.code,
        "subPrefectureCode": values1?.birthDetails?.subPrefecture?.code
        },
        "address": {
        "subPrefectureCode": values1?.address?.subPrefecture?.code,
        "agencyCode": values1?.address?.agency?.code
        },
        "contactDetails": {
        "mobileNumber": values1?.contactDetails?.mobileNumber,
        "landlineNumber": values1?.contactDetails?.landlineNumber,
        "email": values1?.contactDetails?.email,
        "postOfficeBox": values1?.contactDetails?.postOfficeBox
        },
        "professionalDetails": {
        "personTypeCode": values1?.professionalDetails?.personCategory?.code,
        "professionCode": values1?.professionalDetails?.profession?.code,
        "employerCompanyCode": values1?.professionalDetails?.employer?.code,
        "registrationNumberTypeCode": values1?.professionalDetails?.registrationNumberTypeCode,
        "registrationNumber": values1?.professionalDetails?.registrationNumber,
        },
        "subscriptionDetails": {
        "paidByCode": values1?.subscriptionDetails?.paidBy?.code,
        "payer": {
        "cnamNumber": values1?.subscriptionDetails?.payer?.cnamNumber,
        "enrolmentId": values1?.subscriptionDetails?.payer?.enrolmentId,
        "firstName": values1?.subscriptionDetails?.payer?.firstName,
        "lastName": values1?.subscriptionDetails?.payer?.lastName
        }
        }
       }
    )
    // console.log(value)
},[values1])

  const lstatus = ["ACTIVE", "INACTIVE"];
  

  const handleNumber = e => {
    const value = e.target.value.replace(/\D/g, "");
    setMobilenumber(value);
  };
  const handlePassword = e => {
    const value = e.target.value;
    setPassword(value);
  };
  const downLg = useMediaQuery(theme.breakpoints.down('md'));
  const handleName = useCallback(e => {
    const value = e.target.value;
    setValues(prev => ({ ...prev, displayName: value }));
  }, []);
  const handleRole = useCallback((e, value) => {
    setValues(prev => ({ ...prev, role: value }));
  }, []);
  const handleReportingRole = useCallback((e, value) => {
    setValues(prev => ({ ...prev, reportingRole: value }));
  }, []);
  const handleStatus = useCallback((e, value) => {
    setValues(prev => ({ ...prev, status: value }));
  }, []);
  const handleBranch = useCallback((e, value) => {
    setValues(prev => ({ ...prev, branchId: value?.value }));
  }, []);
  useEffect(() => {
    if (password.length === 1) {
      setTimeout(() => {
        setShowPassword(true);
      }, 1);
      setTimeout(() => {
        setShowPassword(false);
      }, 2);
    }
  }, [password]);

  const handleSubmit =() => {
      // e.preventDefault();
     
      if(!bool){
        setLoading(true)
        axios.put(`/api/enrolment/${enrolmentId}/details`,
      {
          ...value
      },
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${login?.data?.accessToken}`,
          },
        },
      ).then(res=>{
        toast.success(`Enrolment Updated Successfully`);
        // navigate('/enrollments')
      }).catch(err=>{
        toast.error(`${err.response.data.error.message}`);
      }).finally(()=>{
        setLoading(false)
      })
      }
      if(!bool2){
        setLoading(true)
        axios.put(`/api/enrolment/${enrolmentId}/details`,
      {
          ...value1
      },
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${login?.data?.accessToken}`,
          },
        },
      ).then(res=>{
        toast.success(`Enrolment Updated Successfully`);
        // navigate('/enrollments')
      }).catch(err=>{
        toast.error(`${err.response.data.error.message}`);
      }).finally(()=>{
        setLoading(false)
      })
      }
      
    }
  const handleSubmit1 =() => {
    setLoading(true)
    axios.put(`/api/enrolment/${enrolmentId}/details`,
  {
      ...value
  },
    {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${login?.data?.accessToken}`,
      },
    },
  ).then(res=>{
    toast.success(`Enrolment Updated Successfully`);
    navigate('/enrollments')
  }).catch(err=>{
    toast.error(`${err.response.data.error.message}`);
  }).finally(()=>{
    setLoading(false)
  }) 
    }
    
const [bool,setBool] = useState(true)
const [bool2,setBool2] = useState(true)
const [bool3,setBool3] = useState(true)
const handleApprove = ()=> {
    setLoading(true);
    axios
      .patch(
        `/api/management/enrolment/${enrolmentId}`,
        {
          approvalStatus: 'APPROVED',
        },
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${login?.data?.accessToken}`,
          },
        },
      )
      .then((res) => {
        if(res.data?.data?.code === 'E500-00-001'){
          // setRefresh(prev => !prev);
          toast.error("server error, please try again later");
        }
        else{
          toast.success("Approved Successfully")
          navigate('/enrollments')
        }
        setLoading(false);
      }).catch(err=>{
        setLoading(false);
        toast.error(`${err.response.data.error.message}`);
      }).finally(()=>{
        setLoading(false);
      });
  }

const handleReject = () => {
    setLoading(true);
    axios
      .patch(
        `/api/management/enrolment/${enrolmentId}`,
        {
          approvalStatus: 'REJECTED',
        },
        {
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${login?.data?.accessToken}`,
          },
        },
      )
      .then((res) => {
        if(res.data?.data?.code === 'E500-00-001'){
          // setRefresh(prev => !prev);
          toast.error("server error, please try again later");
        }
        else{
          toast.success("Rejected Successfully")
          navigate('/enrollments')
        }
        setLoading(false);
      }).catch(err=>{
        setLoading(false);
        toast.error(`${err.response.data.error.message}`);
      }).finally(()=>{
        setLoading(false);
      });;
  }
  return (
    
    <Box height={'auto'}>
      {approvalRequired==='true' && approvalStatus==='null' ? 
      <Grid container  style={{background:'#FFFFFF',borderRadius:'0.5rem'}} position={'relative'} minHeight={'70vh'} height={'auto'} padding={'0 0 0 2rem'}>
        
      {loading ?  <Box position={'absolute'} display={'flex'} alignItems={'center'} justifyContent={'center'} top={'50%'} left={'50%'} style={{'transform':'translate(-50%,-50%)'}}><CircularProgress /></Box>:<Box width={'100%'} display={'flex'} flexWrap={'wrap'} justifyContent={'space-between'} flexDirection={'column'}  height={'auto'}> 
      <Box textAlign={'center'} marginTop={'2rem'} fontSize={'1.5rem'} borderBottom={'1px dotted black'}  marginRight={'2.5rem'} paddingBottom={'0.5rem'}>
        <Typography variant="body2" fontSize={'1.7rem'} fontWeight={'600'}>Duplicate Record Comparision</Typography>
      </Box>
      <Box width={'100%'} display={'flex'} justifyContent={'space-between'} flexWrap={'wrap'} >
      <Box  width={downLg ? '90%' : '45%'} >
      
      <Box display={'flex'} justifyContent={'space-between'}>
      <label style={{marginTop:'2rem'}}><b>Personal Details</b></label>
      {/* <Tooltip
                   title='EDIT'
                   TransitionComponent={Fade}
                   TransitionProps={{ timeout: 600 }}
                  
                 >
                   <IconButton
                    style={{'height':'3rem',width:'3rem'}}
                   //  disabled={user?.approvalRequired===false}
                     aria-label='edit'
                     size='small'
                     onClick={() => {
                       // navigate(
                       //   `/enrollments/edit/${user.enrolmentId}`,
                       // );
                       setBool(false)
                       setBool2(true)
                     }}
                   >
                     <EditIcon />
                   </IconButton>
                 </Tooltip> */}
      </Box>
          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Title Code :</label>
          <TextField size="small" required placeholder="Title Code"  name="name"  value={values?.personalDetails?.title?.code} autoFocus onChange={(e)=>{setValues({...values,personalDetails:{...values?.personalDetails,title:{
            ...values.personalDetails.title,code:e.target.value
          }}})}}
          disabled={bool}
          />
          </Grid>
          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>First Name :</label>
          <TextField size="small" required placeholder="firstName"  name="firstName"  value={values?.personalDetails?.firstNames} onChange={(e)=>{setValues({...values,personalDetails:{...values?.personalDetails,firstNames:e.target.value}})}} disabled={bool}/>
          </Grid>
          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Last Name :</label>
          <TextField size="small" required placeholder="lastName"  name="lastName"  value={values?.personalDetails?.lastName}
          onChange={(e)=>{setValues({...values,personalDetails:{...values?.personalDetails,lastName:e.target.value}})}} disabled={bool}/>
          </Grid>
          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Nationality Code :</label>
          <TextField size="small" required placeholder="currentNationalityCode"  name="currentNationalityCode"  value={values?.personalDetails?.currentNationality?.code} onChange={(e)=>{setValues({...values,personalDetails:{...values?.personalDetails,currentNationality:{
            ...values.personalDetails.currentNationality,code:e.target.value
          }}})}} disabled={bool}/>
          </Grid>
          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Marital Status :</label>
          <TextField size="small" required placeholder="maritalStatusCode" name="MaritalStatusCode"  value={values?.personalDetails?.maritalStatus?.code} onChange={(e)=>{setValues({...values,personalDetails:{...values?.personalDetails,maritalStatus:{
            ...values.personalDetails.maritalStatus,code:e.target.value
          }}})}} disabled={bool}/>
          </Grid>
          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Maiden Name :</label>
          <TextField size="small" required placeholder="MaidenName" name="maidenName"  value={values?.personalDetails?.maidenName} onChange={(e)=>{setValues({...values,personalDetails:{...values?.personalDetails,maidenName:e.target.value}})}} disabled={bool}/>
          </Grid>

          <label style={{marginTop:'2rem'}}><b>Birth Details</b></label>


          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Date :</label>
          <TextField size="small" required placeholder="Date"  name="date"  value={values?.birthDetails?.date} onChange={(e)=>{setValues({...values,birthDetails:{...values?.birthDetails,date:e.target.value}})}} disabled={bool}/>
          </Grid>
          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Certificate Number :</label>
          <TextField size="small" required placeholder="CertificateNumber" name="certificateNumber"  value={values?.birthDetails?.certificateNumber}  onChange={(e)=>{setValues({...values,birthDetails:{...values?.birthDetails,certificateNumber:e.target.value}})}} disabled={bool}/>
          </Grid>
          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Certificate IssueDate :</label>
          <TextField size="small" required placeholder="CertificateIssueDate"  name="CertificateIssueDate"  value={values?.birthDetails?.certificateIssueDate}  onChange={(e)=>{setValues({...values,birthDetails:{...values?.birthDetails,certificateIssueDate:e.target.value}})}} disabled={bool}/>
          </Grid>

          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Country Code :</label>
          <TextField size="small" required placeholder="CountryCode"  name="CountryCode"  value={values?.birthDetails?.country?.code} onChange={(e)=>{setValues({...values,birthDetails:{...values?.birthDetails,country:{
            ...values.birthDetails.country,code:e.target.value
          }}})}} disabled={bool}/>
          </Grid>

          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>SubPrefecture Code :</label>
          <TextField size="small" required placeholder="SubPrefectureCode" name="subPrefectureCode"  value={values?.birthDetails?.subPrefecture?.code} onChange={(e)=>{setValues({...values,birthDetails:{...values?.birthDetails,subPrefecture:{
            ...values.birthDetails.subPrefecture,code:e.target.value
          }}})}} disabled={bool}/>
          </Grid>




          <label style={{marginTop:'2rem'}}><b>Address</b></label>


          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>SubPrefecture Code :</label>
          <TextField size="small" required placeholder="SubPrefectureCode" name="subPrefectureCode"  value={values?.address?.subPrefecture?.code} onChange={(e)=>{setValues({...values,address:{...values?.address,subPrefecture:{
            ...values.address.subPrefecture,code:e.target.value
          }}})}} disabled={bool}/>
          </Grid>

          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Agency Code :</label>
          <TextField size="small" required placeholder="AgencyCode" name="agencyCode"  value={values?.address?.agency?.code} 
          onChange={(e)=>{setValues({...values,address:{...values?.address,agency:{
            ...values.address.agency,code:e.target.value
          }}})}} disabled={bool}/>
          </Grid>
          <label style={{marginTop:'2rem'}}><b>Contact Details</b></label>
          

          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Mobile Number :</label>
          <TextField size="small" required placeholder="MobileNumber" name="agencyCode"  value={values?.contactDetails?.mobileNumber} onChange={(e)=>{setValues({...values,contactDetails:{...values?.contactDetails,mobileNumber:e.target.value}})}} disabled={bool}/>
          </Grid>

          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Landline Number :</label>
          <TextField size="small" required placeholder="LandlineNumber" name="landlineNumber"  value={values?.contactDetails?.landlineNumber} onChange={(e)=>{setValues({...values,contactDetails:{...values?.contactDetails,landlineNumber:e.target.value}})}} disabled={bool}/>
          </Grid>

          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Email :</label>
          <TextField size="small" required placeholder="Email"  name="email"  value={values?.contactDetails?.email}  onChange={(e)=>{setValues({...values,contactDetails:{...values?.contactDetails,email:e.target.value}})}} disabled={bool}/>
          </Grid>


          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Post Office Box :</label>
          <TextField size="small" required placeholder="PostOfficeBox" name="postOfficeBox"  value={values?.contactDetails?.postOfficeBox} onChange={(e)=>{setValues({...values,contactDetails:{...values?.contactDetails,postOfficeBox:e.target.value}})}} disabled={bool}/>
          </Grid>




          <label style={{marginTop:'2rem'}}><b>Professional Details</b></label>

          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Person Type Code :</label>
          <TextField size="small" required placeholder="PersonTypeCode" name="personTypeCode"  value={values?.professionalDetails?.personCategory?.code} onChange={(e)=>{setValues({...values,professionalDetails:{...values?.professionalDetails,personCategory:{
            ...values.professionalDetails.personCategory,code:e.target.value
          }}})}} disabled={bool}/>
          </Grid>


          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Profession Code :</label>
          <TextField size="small" required placeholder="ProfessionCode" name="professionCode"  value={values?.professionalDetails?.profession?.code}  onChange={(e)=>{setValues({...values,professionalDetails:{...values?.professionalDetails,profession:{
            ...values.professionalDetails.profession,code:e.target.value
          }}})}} disabled={bool}/>
          </Grid>


          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Employer Company Code :</label>
          <TextField size="small" required placeholder="EmployerCompanyCode"  name="employerCompanyCode"  value={values?.professionalDetails?.employer?.code} onChange={(e)=>{setValues({...values,professionalDetails:{...values?.professionalDetails,employer:{
            ...values.professionalDetails.employer,code:e.target.value
          }}})}} disabled={bool}/>
          </Grid>


          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Registration No Type Code:</label>
          <TextField size="small" required placeholder="RegistrationNumberCode"  name="registrationNumberTypeCode"  value={values?.professionalDetails?.registrationNumberType} onChange={(e)=>{setValues({...values,professionalDetails:{...values?.professionalDetails,registrationNumberType:e.target.value}})}} disabled={bool}/>
          </Grid>

          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Registration Number :</label>
          <TextField size="small" required placeholder="RegistrationNumber"  name="registrationNumber"  value={values?.professionalDetails?.registrationNumber} onChange={(e)=>{setValues({...values,professionalDetails:{...values?.professionalDetails,registrationNumber:e.target.value}})}} disabled={bool}/>
          </Grid>


          <label style={{marginTop:'2rem'}}><b>Subscription Details</b></label>

          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Paid By Code :</label>
          <TextField size="small" required placeholder="PaidByCode"  name="paidByCode"  value={values?.subscriptionDetails?.paidBy?.code} onChange={(e)=>{setValues({...values,subscriptionDetails:{...values?.subscriptionDetails,paidBy:{
            ...values.subscriptionDetails.paidBy,code:e.target.value
          }}})}} disabled={bool}/>
          </Grid>


          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Payer Cnam Number :</label>
          <TextField size="small" required placeholder="CnamNumber"  name="paidByCode"  value={values?.subscriptionDetails?.payer?.cnamNumber} onChange={(e)=>{setValues({...values,subscriptionDetails:{...values?.subscriptionDetails,payer:{
            ...values.subscriptionDetails.payer,cnamNumber:e.target.value
          }}})}} disabled={bool}/>
          </Grid>


          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Payer EnrolmentId :</label>
          <TextField size="small" required placeholder="EnrolmentId"  name="enrolmentId"  value={values?.subscriptionDetails?.payer?.enrolmentId} onChange={(e)=>{setValues({...values,subscriptionDetails:{...values?.subscriptionDetails,payer:{
            ...values.subscriptionDetails.payer,enrolmentId:e.target.value
          }}})}} disabled={bool}/>
          </Grid>


          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Payer First Name :</label>
          <TextField size="small" required placeholder="FirstName"  name="firstName"  value={values?.subscriptionDetails?.payer?.firstName} onChange={(e)=>{setValues({...values,subscriptionDetails:{...values?.subscriptionDetails,payer:{
            ...values.subscriptionDetails.payer,firstName:e.target.value
          }}})}} disabled={bool}/>
          </Grid>

          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Payer Last Name :</label>
          <TextField size="small" required placeholder="LastName"  name="lastName"  value={values?.subscriptionDetails?.payer?.lastName} onChange={(e)=>{setValues({...values,subscriptionDetails:{...values?.subscriptionDetails,payer:{
            ...values.subscriptionDetails.payer,lastName:e.target.value
          }}})}} disabled={bool}/>
          </Grid>
          <Box style={{display:'flex',justifyContent:'space-around',alignItems:'center'}} marginLeft={downLg?'3rem':'3rem'}>
          <input
       type="submit"
       className=' btn btn-secondary rounded'
       variant='success'
       value='EDIT'
       onClick={()=>{
        setBool(false)
        setBool2(true)
       }}
      //  disabled={bool}
       style={{width:'7rem',marginTop:'2rem'}}
        />
          <input
       type="submit"
       className=' btn btn-success rounded'
       variant='success'
       value='UPDATE'
       onClick={()=>{handleSubmit()}}
       disabled={bool}
       style={{width:'7rem',marginTop:'2rem'}}
        />
        </Box>
      </Box>
          <Box borderRight={downLg ? '':'1px dotted black'} width={downLg ? '0%' : '1%'} marginTop={'1rem'}>

          </Box>
          <Box  width={downLg ? '90%' : '45%'} marginRight={downLg ? '0' : '2rem'}>
      
          <Box display={'flex'} justifyContent={'space-between'}>
      <label style={{marginTop:'2rem'}}><b>Personal Details</b></label>
      {/* <Tooltip
                   title='EDIT'
                   TransitionComponent={Fade}
                   TransitionProps={{ timeout: 600 }}
                  
                 >
                   <IconButton
                    style={{'height':'3rem',width:'3rem'}}
                   //  disabled={user?.approvalRequired===false}
                     aria-label='edit'
                     size='small'
                     onClick={() => {
                       // navigate(
                       //   `/enrollments/edit/${user.enrolmentId}`,
                       // );
                       setBool2(false)
                       setBool(true)
                     }}
                   >
                     <EditIcon />
                   </IconButton>
                 </Tooltip> */}
      </Box>
      <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Title Code :</label>
          <TextField size="small" required placeholder="Title Code"  name="name"  value={values1?.personalDetails?.title?.code} autoFocus onChange={(e)=>{setvalues1({...values1,personalDetails:{...values1?.personalDetails,title:{
            ...values1.personalDetails.title,code:e.target.value
          }}})}}
          disabled={bool2}
          />
          </Grid>
          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>First Name :</label>
          <TextField size="small" required placeholder="firstName"  name="firstName"  value={values1?.personalDetails?.firstNames} onChange={(e)=>{setvalues1({...values1,personalDetails:{...values1?.personalDetails,firstNames:e.target.value}})}} disabled={bool2}/>
          </Grid>
          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Last Name :</label>
          <TextField size="small" required placeholder="lastName"  name="lastName"  value={values1?.personalDetails?.lastName}
          onChange={(e)=>{setvalues1({...values1,personalDetails:{...values1?.personalDetails,lastName:e.target.value}})}} disabled={bool2}/>
          </Grid>
          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Nationality Code :</label>
          <TextField size="small" required placeholder="currentNationalityCode"  name="currentNationalityCode"  value={values1?.personalDetails?.currentNationality?.code} onChange={(e)=>{setvalues1({...values1,personalDetails:{...values1?.personalDetails,currentNationality:{
            ...values1.personalDetails.currentNationality,code:e.target.value
          }}})}} disabled={bool2}/>
          </Grid>
          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Marital Status :</label>
          <TextField size="small" required placeholder="maritalStatusCode" name="MaritalStatusCode"  value={values1?.personalDetails?.maritalStatus?.code} onChange={(e)=>{setvalues1({...values1,personalDetails:{...values1?.personalDetails,maritalStatus:{
            ...values1.personalDetails.maritalStatus,code:e.target.value
          }}})}} disabled={bool2}/>
          </Grid>
          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Maiden Name :</label>
          <TextField size="small" required placeholder="MaidenName" name="maidenName"  value={values1?.personalDetails?.maidenName} onChange={(e)=>{setvalues1({...values1,personalDetails:{...values1?.personalDetails,maidenName:e.target.value}})}} disabled={bool2}/>
          </Grid>

          <label style={{marginTop:'2rem'}}><b>Birth Details</b></label>


          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Date :</label>
          <TextField size="small" required placeholder="Date"  name="date"  value={values1?.birthDetails?.date} onChange={(e)=>{setvalues1({...values1,birthDetails:{...values1?.birthDetails,date:e.target.value}})}} disabled={bool2}/>
          </Grid>
          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Certificate Number :</label>
          <TextField size="small" required placeholder="CertificateNumber" name="certificateNumber"  value={values1?.birthDetails?.certificateNumber}  onChange={(e)=>{setvalues1({...values1,birthDetails:{...values1?.birthDetails,certificateNumber:e.target.value}})}} disabled={bool2}/>
          </Grid>
          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Certificate IssueDate :</label>
          <TextField size="small" required placeholder="CertificateIssueDate"  name="CertificateIssueDate"  value={values1?.birthDetails?.certificateIssueDate}  onChange={(e)=>{setvalues1({...values1,birthDetails:{...values1?.birthDetails,certificateIssueDate:e.target.value}})}} disabled={bool2}/>
          </Grid>

          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Country Code :</label>
          <TextField size="small" required placeholder="CountryCode"  name="CountryCode"  value={values1?.birthDetails?.country?.code} onChange={(e)=>{setvalues1({...values1,birthDetails:{...values1?.birthDetails,country:{
            ...values1.birthDetails.country,code:e.target.value
          }}})}} disabled={bool2}/>
          </Grid>

          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>SubPrefecture Code :</label>
          <TextField size="small" required placeholder="SubPrefectureCode" name="subPrefectureCode"  value={values1?.birthDetails?.subPrefecture?.code} onChange={(e)=>{setvalues1({...values1,birthDetails:{...values1?.birthDetails,subPrefecture:{
            ...values1.birthDetails.subPrefecture,code:e.target.value
          }}})}} disabled={bool2}/>
          </Grid>




          <label style={{marginTop:'2rem'}}><b>Address</b></label>


          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>SubPrefecture Code :</label>
          <TextField size="small" required placeholder="SubPrefectureCode" name="subPrefectureCode"  value={values1?.address?.subPrefecture?.code} onChange={(e)=>{setvalues1({...values1,address:{...values1?.address,subPrefecture:{
            ...values1.address.subPrefecture,code:e.target.value
          }}})}} disabled={bool2}/>
          </Grid>

          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Agency Code :</label>
          <TextField size="small" required placeholder="AgencyCode" name="agencyCode"  value={values1?.address?.agency?.code} 
          onChange={(e)=>{setvalues1({...values1,address:{...values1?.address,agency:{
            ...values1.address.agency,code:e.target.value
          }}})}} disabled={bool2}/>
          </Grid>
          <label style={{marginTop:'2rem'}}><b>Contact Details</b></label>
          

          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Mobile Number :</label>
          <TextField size="small" required placeholder="MobileNumber" name="agencyCode"  value={values1?.contactDetails?.mobileNumber} onChange={(e)=>{setvalues1({...values1,contactDetails:{...values1?.contactDetails,mobileNumber:e.target.value}})}} disabled={bool2}/>
          </Grid>

          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Landline Number :</label>
          <TextField size="small" required placeholder="LandlineNumber" name="landlineNumber"  value={values1?.contactDetails?.landlineNumber} onChange={(e)=>{setvalues1({...values1,contactDetails:{...values1?.contactDetails,landlineNumber:e.target.value}})}} disabled={bool2}/>
          </Grid>

          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Email :</label>
          <TextField size="small" required placeholder="Email"  name="email"  value={values1?.contactDetails?.email}  onChange={(e)=>{setvalues1({...values1,contactDetails:{...values1?.contactDetails,email:e.target.value}})}} disabled={bool2}/>
          </Grid>


          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Post Office Box :</label>
          <TextField size="small" required placeholder="PostOfficeBox" name="postOfficeBox"  value={values1?.contactDetails?.postOfficeBox} onChange={(e)=>{setvalues1({...values1,contactDetails:{...values1?.contactDetails,postOfficeBox:e.target.value}})}} disabled={bool2}/>
          </Grid>




          <label style={{marginTop:'2rem'}}><b>Professional Details</b></label>

          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Person Type Code :</label>
          <TextField size="small" required placeholder="PersonTypeCode" name="personTypeCode"  value={values1?.professionalDetails?.personCategory?.code} onChange={(e)=>{setvalues1({...values1,professionalDetails:{...values1?.professionalDetails,personCategory:{
            ...values1.professionalDetails.personCategory,code:e.target.value
          }}})}} disabled={bool2}/>
          </Grid>


          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Profession Code :</label>
          <TextField size="small" required placeholder="ProfessionCode" name="professionCode"  value={values1?.professionalDetails?.profession?.code}  onChange={(e)=>{setvalues1({...values1,professionalDetails:{...values1?.professionalDetails,profession:{
            ...values1.professionalDetails.profession,code:e.target.value
          }}})}} disabled={bool2}/>
          </Grid>


          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Employer Company Code :</label>
          <TextField size="small" required placeholder="EmployerCompanyCode"  name="employerCompanyCode"  value={values1?.professionalDetails?.employer?.code} onChange={(e)=>{setvalues1({...values1,professionalDetails:{...values1?.professionalDetails,employer:{
            ...values1.professionalDetails.employer,code:e.target.value
          }}})}} disabled={bool2}/>
          </Grid>


          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Registration No Type Code :</label>
          <TextField size="small" required placeholder="RegistrationNumberCode"  name="registrationNumberTypeCode"  value={values1?.professionalDetails?.registrationNumberType} onChange={(e)=>{setvalues1({...values1,professionalDetails:{...values1?.professionalDetails,registrationNumberType:e.target.value}})}} disabled={bool2}/>
          </Grid>

          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Registration Number :</label>
          <TextField size="small" required placeholder="RegistrationNumber"  name="registrationNumber"  value={values1?.professionalDetails?.registrationNumber} onChange={(e)=>{setvalues1({...values1,professionalDetails:{...values1?.professionalDetails,registrationNumber:e.target.value}})}} disabled={bool2}/>
          </Grid>


          <label style={{marginTop:'2rem'}}><b>Subscription Details</b></label>

          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Paid By Code :</label>
          <TextField size="small" required placeholder="PaidByCode"  name="paidByCode"  value={values1?.subscriptionDetails?.paidBy?.code} onChange={(e)=>{setvalues1({...values1,subscriptionDetails:{...values1?.subscriptionDetails,paidBy:{
            ...values1.subscriptionDetails.paidBy,code:e.target.value
          }}})}} disabled={bool2}/>
          </Grid>


          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Payer CnamNumber :</label>
          <TextField size="small" required placeholder="CnamNumber"  name="paidByCode"  value={values1?.subscriptionDetails?.payer?.cnamNumber} onChange={(e)=>{setvalues1({...values1,subscriptionDetails:{...values1?.subscriptionDetails,payer:{
            ...values1.subscriptionDetails.payer,cnamNumber:e.target.value
          }}})}} disabled={bool2}/>
          </Grid>


          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Payer EnrolmentId :</label>
          <TextField size="small" required placeholder="EnrolmentId"  name="enrolmentId"  value={values1?.subscriptionDetails?.payer?.enrolmentId} onChange={(e)=>{setvalues1({...values1,subscriptionDetails:{...values1?.subscriptionDetails,payer:{
            ...values1.subscriptionDetails.payer,enrolmentId:e.target.value
          }}})}} disabled={bool2}/>
          </Grid>


          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Payer First Name :</label>
          <TextField size="small" required placeholder="FirstName"  name="firstName"  value={values1?.subscriptionDetails?.payer?.firstName} onChange={(e)=>{setvalues1({...values1,subscriptionDetails:{...values1?.subscriptionDetails,payer:{
            ...values1.subscriptionDetails.payer,firstName:e.target.value
          }}})}} disabled={bool2}/>
          </Grid>

          <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
          <label style={{margin:'0.5rem'}}>Payer Last Name :</label>
          <TextField size="small" required placeholder="LastName"  name="lastName"  value={values1?.subscriptionDetails?.payer?.lastName} onChange={(e)=>{setvalues1({...values1,subscriptionDetails:{...values1?.subscriptionDetails,payer:{
            ...values1.subscriptionDetails.payer,lastName:e.target.value
          }}})}} disabled={bool2}/>
          </Grid>
          <Box style={{display:'flex',justifyContent:'space-around',alignItems:'center'}} marginLeft={downLg?'3rem':'3rem'}>
          <input
       type="submit"
       className=' btn btn-secondary rounded'
       variant='success'
       value='EDIT'
       onClick={()=>{
        setBool(true)
        setBool2(false)
       }}
      //  disabled={bool}
       style={{width:'7rem',marginTop:'2rem'}}
        />
          <input
       type="submit"
       className=' btn btn-success rounded'
       variant='success'
       value='UPDATE'
       onClick={()=>{handleSubmit()}}
       disabled={bool2}
       style={{width:'7rem',marginTop:'2rem'}}
        />
        </Box>
      </Box>
      </Box>
      <Box borderBottom={'1px dotted black'} display={'flex'} justifyContent={'center'} alignContent={'center'} marginLeft={'2rem'} marginRight={'2.5rem'} marginTop={"2rem"}>
        </Box>
         <Box display={'flex'} justifyContent={'center'} width={'100%'} gap={1} marginLeft={downLg ? '0rem' : '0.5rem'} marginBottom={'20px'} marginTop={'2rem'} paddingRight={'2rem'}>
         <input
       type="submit"
       className=' btn btn-warning rounded'
       variant='success'
       value='CANCEL'
       onClick={()=>{
        navigate('/enrollments')
       }}
       style={{width:'10rem'}}
      //  disabled={bool && bool2}

        />
          
        <input
       type="submit"
       className=' btn btn-danger rounded'
       variant='success'
       value='REJECT'
       onClick={()=>{handleReject()}}
       style={{width:'10rem'}}
      //  disabled={bool && bool2}

        />
        <input
       type="submit"
       className=' btn btn-success rounded'
       variant='success'
       value='APPROVE'
       onClick={()=>{handleApprove()}}
       style={{width:'10rem'}}
      //  disabled={bool && bool2}

        />
        </Box>

        </Box>}
       
      </Grid>
      : 
      <Grid container gap={4} style={{background:'#FFFFFF',borderRadius:'0.5rem'}} position={'relative'} minHeight={'70vh'} padding={'0 0 0 2rem'}>
        <Box textAlign={'center'}  marginRight={'2rem'} marginTop={'2rem'} width={'100%'} borderBottom={'1px dotted black'} paddingBottom={'0.5rem'} >
        <Typography variant="body2" fontSize={'1.7rem'} fontWeight={'600'}>Enrollment Details</Typography>
      </Box>
       {loading ?  <Box position={'absolute'} display={'flex'} alignItems={'center'} justifyContent={'center'} top={'50%'} left={'50%'} style={{'transform':'translate(-50%,-50%)'}}><CircularProgress /></Box> : <>
        <Box  width={downLg ? '100%' : '45%'}>
         
        <label ><b>Personal Details</b></label>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Title Code :</label>
            <TextField size="small"  placeholder="Title Code" name="name"  value={values?.personalDetails?.title?.code} autoFocus onChange={(e)=>{setValues({...values,personalDetails:{...values?.personalDetails,title:{
            ...values.personalDetails.title,code:e.target.value
          }}})}} disabled={bool3} />
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>First Name :</label>
            <TextField size="small"  placeholder="firstName"  name="firstName"  value={values?.personalDetails?.firstNames} onChange={(e)=>{setValues({...values,personalDetails:{...values?.personalDetails,firstNames:e.target.value}})}} disabled={bool3}   />
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Last Name :</label>
            <TextField size="small"  placeholder="lastName"  name="lastName"  value={values?.personalDetails?.lastName}
          onChange={(e)=>{setValues({...values,personalDetails:{...values?.personalDetails,lastName:e.target.value}})}}  disabled={bool3}  />
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Nationality Code :</label>
            <TextField size="small"  placeholder="currentNationalityCode"  name="currentNationalityCode"  value={values?.personalDetails?.currentNationality?.code} onChange={(e)=>{setValues({...values,personalDetails:{...values?.personalDetails,currentNationality:{
            ...values.personalDetails.currentNationality,code:e.target.value
          }}})}}  disabled={bool3}  />
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Marital Status :</label>
            <TextField size="small"  placeholder="maritalStatusCode"  name="MaritalStatusCode"  value={values?.personalDetails?.maritalStatus?.code} onChange={(e)=>{setValues({...values,personalDetails:{...values?.personalDetails,maritalStatus:{
            ...values.personalDetails.maritalStatus,code:e.target.value
          }}})}}  disabled={bool3}  />
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Maiden Name :</label>
            <TextField size="small"  placeholder="MaidenName"    name="maidenName"  value={values?.personalDetails?.maidenName} onChange={(e)=>{setValues({...values,personalDetails:{...values?.personalDetails,maidenName:e.target.value}})}}  disabled={bool3}  />
            </Grid>

            <label style={{marginTop:'2rem'}}><b>Birth Details</b></label>


            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Date :</label>
            <TextField size="small"  placeholder="Date"  name="date"  value={values?.birthDetails?.date} onChange={(e)=>{setValues({...values,birthDetails:{...values?.birthDetails,date:e.target.value}})}}  disabled={bool3}  />
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Certificate Number :</label>
            <TextField size="small"  placeholder="CertificateNumber" name="certificateNumber"  value={values?.birthDetails?.certificateNumber}  onChange={(e)=>{setValues({...values,birthDetails:{...values?.birthDetails,certificateNumber:e.target.value}})}} disabled={bool3} />
            </Grid>
            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Certificate IssueDate :</label>
            <TextField size="small"  placeholder="CertificateIssueDate" name="CertificateIssueDate"   value={values?.birthDetails?.certificateIssueDate}  onChange={(e)=>{setValues({...values,birthDetails:{...values?.birthDetails,certificateIssueDate:e.target.value}})}}  disabled={bool3}  />
            </Grid>

            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Country Code :</label>
            <TextField size="small"  placeholder="CountryCode"  name="CountryCode"  value={values?.birthDetails?.country?.code} onChange={(e)=>{setValues({...values,birthDetails:{...values?.birthDetails,country:{
            ...values.birthDetails.country,code:e.target.value
          }}})}}  disabled={bool3}  />
            </Grid>

            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>SubPrefecture Code :</label>
            <TextField size="small"  placeholder="SubPrefectureCode" name="subPrefectureCode"  value={values?.birthDetails?.subPrefecture?.code} onChange={(e)=>{setValues({...values,birthDetails:{...values?.birthDetails,subPrefecture:{
            ...values.birthDetails.subPrefecture,code:e.target.value
          }}})}} disabled={bool3}/>
            </Grid>




            <label style={{marginTop:'2rem'}}><b>Address</b></label>


            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>SubPrefecture Code :</label>
            <TextField size="small"  placeholder="SubPrefectureCode" name="subPrefectureCode"  value={values?.address?.subPrefecture?.code} onChange={(e)=>{setValues({...values,address:{...values?.address,subPrefecture:{
            ...values.address.subPrefecture,code:e.target.value
          }}})}} disabled={bool3}   />
            </Grid>

            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Agency Code :</label>
            <TextField size="small"  placeholder="AgencyCode"  name="agencyCode"  value={values?.address?.agency?.code} 
          onChange={(e)=>{setValues({...values,address:{...values?.address,agency:{
            ...values.address.agency,code:e.target.value
          }}})}} disabled={bool3} />
            </Grid>
        </Box>

        <Box  width={downLg ? '100%' : '45%'} marginLeft={downLg ? '0' : '1rem'}>
        
        <label ><b>Contact Details</b></label>
            

            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Mobile Number :</label>
            <TextField size="small"  placeholder="MobileNumber"  name="agencyCode"   value={values?.contactDetails?.mobileNumber} onChange={(e)=>{setValues({...values,contactDetails:{...values?.contactDetails,mobileNumber:e.target.value}})}}  disabled={bool3}  />
            </Grid>

            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Landline Number :</label>
            <TextField size="small"  placeholder="LandlineNumber" name="landlineNumber"   value={values?.contactDetails?.landlineNumber} onChange={(e)=>{setValues({...values,contactDetails:{...values?.contactDetails,landlineNumber:e.target.value}})}}  disabled={bool3}  />
            </Grid>

            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Email :</label>
            <TextField size="small"  placeholder="Email"  name="email"  value={values?.contactDetails?.email} onChange={(e)=>{setValues({...values,contactDetails:{...values?.contactDetails,email:e.target.value}})}} disabled={bool3} />
            </Grid>


            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Post Office Box :</label>
            <TextField size="small"  placeholder="PostOfficeBox" name="postOfficeBox"  value={values?.contactDetails?.postOfficeBox} onChange={(e)=>{setValues({...values,contactDetails:{...values?.contactDetails,postOfficeBox:e.target.value}})}}  disabled={bool3}  />
            </Grid>

            <label style={{marginTop:'2rem'}}><b>Professional Details</b></label>

            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Person Type Code :</label>
            <TextField size="small" placeholder="PersonTypeCode" name="personTypeCode" value={values?.professionalDetails?.personCategory?.code}  onChange={(e)=>{setValues({...values,professionalDetails:{...values?.professionalDetails,personCategory:{
            ...values.professionalDetails.personCategory,code:e.target.value
          }}})}}  disabled={bool3}  />
            </Grid>


            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Profession Code :</label>
            <TextField size="small" placeholder="ProfessionCode" name="professionCode" value={values?.professionalDetails?.profession?.code}  onChange={(e)=>{setValues({...values,professionalDetails:{...values?.professionalDetails,profession:{
            ...values.professionalDetails.profession,code:e.target.value
          }}})}} disabled={bool3}/>
            </Grid>


            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Employer Company Code :</label>
            <TextField size="small"  placeholder="EmployerCompanyCode" name="employerCompanyCode"  value={values?.professionalDetails?.employer?.code} onChange={(e)=>{setValues({...values,professionalDetails:{...values?.professionalDetails,employer:{
            ...values.professionalDetails.employer,code:e.target.value
          }}})}}disabled={bool3} />
            </Grid>


            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Registration No Type Code :</label>
            <TextField size="small"  placeholder="RegistrationNumberTypeCode"  name="registrationNumberTypeCode"  value={values?.professionalDetails?.registrationNumberType} onChange={(e)=>{setValues({...values,professionalDetails:{...values?.professionalDetails,registrationNumberType:e.target.value}})}} disabled={bool3}/>
            </Grid>

            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Registration Number :</label>
            <TextField size="small"  placeholder="RegistrationNumber" name="registrationNumber" value={values?.professionalDetails?.registrationNumber} onChange={(e)=>{setValues({...values,professionalDetails:{...values?.professionalDetails,registrationNumber:e.target.value}})}} disabled={bool3}/>
            </Grid>


            <label style={{marginTop:'2rem'}}><b>Subscription Details</b></label>

            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Paid By Code :</label>
            <TextField size="small"  placeholder="PaidByCode"  name="paidByCode" value={values?.subscriptionDetails?.paidBy?.code}  onChange={(e)=>{setValues({...values,subscriptionDetails:{...values?.subscriptionDetails,paidBy:{
            ...values.subscriptionDetails.paidBy,code:e.target.value
          }}})}}  disabled={bool3}  />
            </Grid>


            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Payer CnamNumber :</label>
            <TextField size="small"  placeholder="CnamNumber"  name="paidByCode"  value={values?.subscriptionDetails?.payer?.cnamNumber} onChange={(e)=>{setValues({...values,subscriptionDetails:{...values?.subscriptionDetails,payer:{
            ...values.subscriptionDetails.payer,cnamNumber:e.target.value
          }}})}}   disabled={bool3} />
            </Grid>


            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Payer EnrolmentId :</label>
            <TextField size="small"  placeholder="EnrolmentId"  name="enrolmentId"  value={values?.subscriptionDetails?.payer?.enrolmentId} onChange={(e)=>{setValues({...values,subscriptionDetails:{...values?.subscriptionDetails,payer:{
            ...values.subscriptionDetails.payer,enrolmentId:e.target.value
          }}})}} disabled={bool3}/>
            </Grid>


            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Payer First Name :</label>
            <TextField size="small"  placeholder="FirstName"  name="firstName"  value={values?.subscriptionDetails?.payer?.firstName} onChange={(e)=>{setValues({...values,subscriptionDetails:{...values?.subscriptionDetails,payer:{
            ...values.subscriptionDetails.payer,firstName:e.target.value
          }}})}} disabled={bool3}/>
            </Grid>

            <Grid item marginTop={'1rem'} display={'flex'} justifyContent={'space-between'} >
            <label style={{margin:'0.5rem'}}>Payer Last Name :</label>
            <TextField size="small"  placeholder="LastName"  name="lastName"  value={values?.subscriptionDetails?.payer?.lastName} onChange={(e)=>{setValues({...values,subscriptionDetails:{...values?.subscriptionDetails,payer:{
            ...values.subscriptionDetails.payer,lastName:e.target.value
          }}})}} disabled={bool3}/>
            </Grid>
            
        </Box>
        <Box borderBottom={'1px dotted black'} width={'100%'} display={'flex'} justifyContent={'center'} alignContent={'center'} marginLeft={'2rem'} marginRight={'2rem'}>
        </Box>
        <Box display={'flex'} gap={1} justifyContent={'center'} width={'100%'} marginBottom={'20px'} paddingRight={'2rem'}>
          <input
       type="submit"
       className=' btn btn-warning rounded'
       variant='success'
       value='CANCEL'
       onClick={()=>{navigate('/enrollments')}}
       style={{width:'10rem'}}
      //  disabled={bool && bool2}

        />
          <input
       type="submit"
       className=' btn btn-secondary rounded'
       variant='success'
       value='EDIT'
       onClick={()=>{setBool3(false)}}
       style={{width:'10rem'}}
      //  disabled={bool && bool2}

        />
          <input
       type="submit"
       className=' btn btn-success rounded'
       variant='success'
       value='SUBMIT'
       onClick={()=>{handleSubmit1()}}
       disabled={bool3}
       style={{width:'10rem'}}
      //  disabled={bool && bool2}

        />
        </Box>
        </>}
      </Grid>
      }
      
    </Box>
  );
};

export default UpdateUser;
