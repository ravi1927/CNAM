import React, { useEffect, useCallback } from "react";
import { Worker } from "@react-pdf-viewer/core";
import "jspdf-autotable";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import logo from "../../assets/logo2.png";
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import { Checkbox, FormControl, InputLabel, Autocomplete as MuiAuto,TextField} from "@mui/material";
import {
  Paper,
  Stack,
  Button,
  TablePagination,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  TableContainer,
  IconButton,
  Tooltip,
  CircularProgress,
  Fade,
  Typography,
  useTheme,
  Box
} from "@mui/material";
import Switch from "@mui/material/Switch";
import moment from "moment";

import EditIcon from "@mui/icons-material/Edit";
import { CSVLink } from "react-csv";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// import axios from "../../api/axios";
import axios from "axios";
import useLocalStorage from "../../hooks/useLocalStorage";
import useResponse from "../../helper";

const columns = [
  {
    field: "enrolmentId",
    headerName: "Enrolment ID",
    width: 20,
  },
  { field: "firstName", headerName: "First Name", width: 50 },
  { field: "lastName", headerName: "Last Name", width: 50 },
  { field: "dateOfBirth", headerName: "Date Of Birth", width: 50 },
  { field: "nationality", headerName: "Nationality", width: 50 },
  { field: "personCategory", headerName: "Person Category", width: 50 },
  { field: "startedAt", headerName: "Started At", width: 50 },
  { field: "completedAt", headerName: "Completed At", width: 50 },
  // { field: "approvalRequired", headerName: "approvalRequired", width: 50 },
  // { field: "approvalStatus", headerName: "approvalStatus", width: 50 },
  // { field: "approvedStatusUpdatedAt", headerName: "approvedStatusUpdatedAt", width: 50 },
  // { field: "processedAt", headerName: "processedAt", width: 50 },
];

const headersCsv = [
  {
    label: "No",
    key: "id",
  },
  { label: "FullName", key: "displayName" },
  { label: "Mobile Number", key: "mobileNumber" },
  { label: "Roles", key: "role" },
  { label: "Branch Name", key: "branchName" },
  { label: "Status", key: "status" },
  { label: "Last Login", key: "lastLogin" },
  { label: "Created Date", key: "createdAt" },
  { label: "Created By", key: "createdBy" },
  { label: "Last Modified Date", key: "updatedAt" },
  { label: "Last Modified", key: "updatedBy" },
];

const PDFDate = [
  {
    label: "Sl.No",
    key: "id",
  },
  { label: "Enrolment ID", key: "enrolmentId" },
  { label: "First Name", key: "firstName" },
  { label: "Last Name", key: "lastName" },
  { label: "Date Of Birth", key: "dateOfBirth" },
  { label: "Nationality", key: "nationality" },
  { label: "Person Category", key: "personCategory" },
  { label: "Started At", key: "startedAt" },
  { label: "Completed At", key: "completedAt" },
  // { label: "approvalStatus", key: "approvalStatus" },
  // { label: "approvedStatusUpdatedAt", key: "approvedStatusUpdatedAt" },
  // { label: "processedAt", key: "processedAt" },

  // { label: "passWordEnabled", key: "passwordEnabled" },
];
const Enrollments = ({
  search,
  selectedFilter,
  fromDate,
  toDate,
  roleFilter,
  roleSearch,
}) => {
  // ! Replace
  // const [
  //   { accessToken, reportingRoleName, branchId, branchDistrict, roleName },
  // ] = useLocalStorage("login");
  const login = JSON.parse(sessionStorage?.getItem('login'))
  const [selectedRows, setSelectedRows] = useState([]);
  const [userListData, setUserListData] = useState([]);
  const [userListData2, setUserListData2] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalSize, setTotalSize] = useState(0);
  const { UpdateUserApi, getSingleUser } = useResponse();
  const [csvFile, setCsvFile] = useState([]);
  const theme = useTheme();
  const [cnamfilter, setCnamfilter] = useState([]);

  const [cngender,setCngender] = useState('');

  const [cnapprove,setCnapprove] = useState('');

  const [cnationality,setCnationality] = useState('');

  const [cpercate,setCpercate] = useState('');


  const names = [
    'Gender',
    'Nationality',
    'ApprovalRequired',
    'PersonCategory'
  ];

  const genderoptions = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
    
  ];

  const nationalityoptions = [
    { label: 'IVOIRIENNE', value: 'CIV' },
    { label: 'BURKINABE', value: 'BFA' },
    { label: 'BENINOISE', value: 'BEN' },
    { label: 'MALIENNE', value: 'MLI' },
    { label: 'GHANEENNE', value: 'GHA' },
    { label: 'SENEGALAISE', value: 'SEN' },
    { label: 'GUINEENNE', value: 'GIN' },
    { label: 'NIGERIENNE', value: 'NER' },
    { label: 'TOGOLAISE', value: 'TGO' },
    { label: 'MAURITANIENNE', value: 'MRT' },
    { label: 'NIGERIANNE', value: 'NGA' },
    { label: 'GAMBIENNE', value: 'GMB' },
    { label: 'LIBERIENNE', value: 'LBR' },
    { label: 'CAMEROUNAISE', value: 'CMR' },
    { label: 'CONGOLAISE DE BRAZZAVILLE', value: 'COG' },
    { label: 'CONGOLAISE DE KINSHASA', value: 'COD' },
    { label: 'GABONAISE', value: 'GAB  ' },
    { label: 'SIERRA-LEONAISE', value: 'SLE' },
    { label: 'EQUATO-GUINEENNE', value: 'GNQ' },
    { label: 'BISSAU-GUINEENNE', value: 'GNB' },
    { label: 'CENTRAFRICAINE', value: 'CAF' },
    { label: 'AFGHANE', value: 'AFG' },
    { label: 'SUD-AFRICAINE', value: 'ZAF' },
    { label: 'AALANDAISE', value: 'ALA' },
    { label: 'ALBANAISE', value: 'ALB' },
    { label: 'ALGERIENNE', value: 'DZA' },
    { label: 'ALLEMANDE', value: 'DEU' },
    { label: 'ANDORRANE', value: 'AND' },
    { label: 'ANGOLAISE', value: 'AGO' },
    { label: 'ANGUILLANE', value: 'AIA' },
    { label: 'DE LANTARCTIQUE ', value: 'ATA' },
    { label: 'ANTIGUAISE', value: 'ATG' },
    { label: 'SAOUDIENNE', value: 'SAU' },
    { label: 'ARGENTINE', value: 'ARG' },
    { label: 'ARMENIENNE', value: 'ARM' },
    { label: 'ARUBEENNE', value: 'ABW' },
    { label: 'AUSTRALIENNE', value: 'AUS' },
    { label: 'AUTRICHIENNE', value: 'AUT' },
    { label: 'AZERBAIDJANAISE', value: 'AZE' },
    { label: 'BAHAMEENNE', value: 'BHS' },
    { label: 'BAHREINITE', value: 'BHR' },
    { label: 'BANGLADESHIE', value: 'BGD' },
    { label: 'BARBADIENNE', value: 'BRB' },
    { label: 'BIELORUSSE', value: 'BLR' },
    { label: 'BELGE', value: 'BEL' },
    { label: 'BELIZIENNE', value: 'BLZ' },
    { label: 'BERMUDIENNE', value: 'BMU' },
    { label: 'BHOUTANAISE', value: 'BTN' },
    { label: 'BOLIVIENNE', value: 'BOL' },
    { label: 'DE BONAIRE, ST-EUSTACHE, SABA', value: 'BES' },
    { label: 'BOSNIENNE', value: 'BIH' },
    { label: 'BOTSWANAISE', value: 'BWA' },
    { label: 'DE LILE BOUVET', value: 'BVT' },
    { label: 'BRESILIENNE', value: 'BRA' },
    { label: 'BRUNEIENNE', value: 'BRN' },
    { label: 'BULGARE', value: 'BGR' },
    { label: 'BURUNDAISE', value: 'BDI' },
    { label: 'CAIMANAISE', value: 'CYM' },
    { label: 'CAMBODGIENNE', value: 'KHM' },
    { label: 'CANADIENNE', value: 'CAN' },
    { label: 'CAP-VERDIENNE', value: 'CPV' },
    { label: 'CHILIENNE', value: 'CHL' },
    { label: 'CHINOISE', value: 'CHN' },
    { label: 'DE LILE CHRISTMAS', value: 'CXR' },
    { label: 'CHYPRIOTE', value: 'CYP' },
    { label: 'DES ILES COCOS', value: 'CCK' },
    { label: 'COLOMBIENNE', value: 'COL' },
    { label: 'COMORIENNE', value: 'COM' },
    { label: 'DES ILES COOK', value: 'COK' },
    { label: 'SUD-COREENNE', value: 'KOR' },
    { label: 'NORD-COREENNE', value: 'PRK' },
    { label: 'COSTARICIENNE', value: 'CRI' },
    { label: 'CROATE', value: 'HRV' },
    { label: 'CUBAINE', value: 'CUB' },
    { label: 'DE CURACAO', value: 'CUW' },
    { label: 'DANOISE', value: 'DNK' },
    { label: 'DJIBOUTIENNE', value: 'DJI' },
    { label: 'DOMINICAINE', value: 'DOM' },
    { label: 'DOMINIQUAISE', value: 'DMA' },
    { label: 'EGYPTIENNE', value: 'EGY' },
    { label: 'SALVADORIENNE', value: 'SLV' },
    { label: 'EMIRIENNE', value: 'ARE' },
    { label: 'EQUATORIENNE', value: 'ECU' },
    { label: 'ERYTHREENNE', value: 'ERI' },
    { label: 'ESPAGNOLE', value: 'ESP' },
    { label: 'ESTONIENNE', value: 'EST' },
    { label: 'AMERICAINE', value: 'USA' },
    { label: 'ETHIOPIENNE', value: 'ETH' },
    { label: 'DES ILES FALKLAND', value: 'FLK' },
    { label: 'FEROIENNE', value: 'FRO' },
    { label: 'FIDJIENNE', value: 'FJI' },
    { label: 'FINLANDAISE', value: 'FIN' },
    { label: 'FRANCAISE', value: 'FRA' },
    { label: 'GEORGIENNE', value: 'GEO' },
    { label: 'DE GÉORGIE, ÎLES SANDWICH SUD', value: 'SGS' },
    { label: 'GIBRALTARIENNE', value: 'GIB' },
    { label: 'GRECQUE', value: 'GRC' },
    { label: 'GRENADINE', value: 'GRD' },
    { label: 'GROENLANDAISE', value: 'GRL' },
    { label: 'GUADELOUPEENNE', value: 'GLP' },
    { label: 'GUAMIENNE', value: 'GUM' },
    { label: 'GUATEMALTEQUE', value: 'GTM' },
    { label: 'GUERNESIAISE', value: 'GGY' },
    { label: 'GUYANIENNE', value: 'GUY' },
    { label: 'GUYANAISE', value: 'GUF' },
    { label: 'HAITIENNE', value: 'HTI' },
    { label: 'DES ILES HEARD ET MACDONALD', value: 'HMD' },
    { label: 'HONDURIENNE', value: 'HND' },
    { label: 'HONGKONGAISE', value: 'HKG' },
    { label: 'HONGROISE', value: 'HUN' },
    { label: 'DE LILE DE MAN', value: 'IMN' },
    { label: 'DES ILES MINEURES ELOIGNEES', value: 'UMI' },
    { label: 'DES ILES VIERGES BRITANNIQUES', value: 'VGB' },
    { label: 'DES ILES VIERGES AMERICAINES', value: 'VIR' },
    { label: 'INDIENNE', value: 'IND' },
    { label: 'INDONESIENNE', value: 'IDN' },
    { label: 'IRANIENNE', value: 'IRN' },
    { label: 'IRAQUIENNE', value: 'IRQ' },
    { label: 'IRLANDAISE', value: 'IRL' },
    { label: 'ISLANDAISE', value: 'ISL' },
    { label: 'ISRAELIENNE', value: 'ISR' },
    { label: 'ITALIENNE', value: 'ITA' },
    { label: 'JAMAICAINE', value: 'JAM' },
    { label: 'JAPONAISE', value: 'JPN' },
    { label: 'JERSIAISE', value: 'JEY' },
    { label: 'JORDANIENNE', value: 'JOR' },
    { label: 'KAZAKHE', value: 'KAZ' },
    { label: 'KENYANNE', value: 'KEN' },
    { label: 'KIRGHIZE', value: 'KGZ' },
    { label: 'KIRIBATIENNE', value: 'KIR' },
    { label: 'KOSOVO', value: 'XKO' },
    { label: 'KOWEITI', value: 'KWT' },
    { label: 'LAOTIENNE', value: 'LAO' },
    { label: 'LOTI', value: 'LSO' },
    { label: 'LETTONNE', value: 'LVA' },
    { label: 'LIBANAISE', value: 'LBN' },
    { label: 'LIBYENNE', value: 'LBY' },
    { label: 'LIECHTENSTEINOISE', value: 'LIE' },
    { label: 'LITUANIENNE', value: 'LTU' },
    { label: 'LUXEMBOURGEOISE', value: 'LUX' },
    { label: 'DE MACAO', value: 'MAC' },
    { label: 'MACEDONIENNE', value: 'MKD' },
    { label: 'MALGACHE', value: 'MDG' },
    { label: 'MALAISIENNE', value: 'MYS' },
    { label: 'MALAWIENNE', value: 'MWI' },
    { label: 'MALDIVIENNE', value: 'MDV' },
    { label: 'MALTAISE', value: 'MLT' },
    { label: 'DES ILES MARIANNES DU NORD', value: 'MNP' },
    { label: 'MAROCAINE', value: 'MAR' },
    { label: 'MARSHALLAISE', value: 'MHL' },
    { label: 'MARTINIQUAISE', value: 'MTQ' },
    { label: 'MAURICIENNE', value: 'MUS' },
    { label: 'MAHORAISE', value: 'MYT' },
    { label: 'MEXICAINE', value: 'MEX' },
    { label: 'MICRONESIENNE', value: 'FSM' },
    { label: 'MOLDAVE', value: 'MDA' },
    { label: 'MONEGASQUE', value: 'MCO' },
    { label: 'MONGOLE', value: 'MNG' },
    { label: 'MONTENEGRINE', value: 'MNE' },
    { label: 'DE MONTSERRAT', value: 'MSR' },
    { label: 'MOZAMBICAINE', value: 'MOZ' },
    { label: 'BIRMANE', value: 'MMR' },
    { label: 'NAMIBIENNE', value: 'NAM' },
    { label: 'NAURUANNE', value: 'NRU' },
    { label: 'NEPALAISE', value: 'NPL' },
    { label: 'NICARAGUAYENNE', value: 'NIC' },
    { label: 'NIOUEENNE', value: 'NIU' },
    { label: 'DE LILE NORFOLK', value: 'NFK' },
    { label: 'NORVEGIENNE', value: 'NOR' },
    { label: 'NEO-CALEDONIENNE', value: 'NCL' },
    { label: 'NEO-ZELANDAISE', value: 'NZL' },
    { label: 'DU TERR BRITANNIQUE OC INDIEN', value: 'IOT' },
    { label: 'OMANAISE', value: 'OMN' },
    { label: 'OUGANDAISE', value: 'UGA' },
    { label: 'OUZBEKE', value: 'UZB' },
    { label: 'PAKISTANAISE', value: 'PAK' },
    { label: 'PALAOSIENNE', value: 'PLW' },
    { label: 'PALESTINIENNE', value: 'PSE' },
    { label: 'PANAMEENNE', value: 'PAN' },
    { label: 'PAPOUASIENNE', value: 'PNG' },
    { label: 'PARAGUAYENNE', value: 'PRY' },
    { label: 'NEERLANDAISE', value: 'NLD' },
    { label: 'PERUVIENNE', value: 'PER' },
    { label: 'PHILIPPINE', value: 'PHL' },
    { label: 'DES ILES PITCAIRN', value: 'PCN' },
    { label: 'POLONAISE', value: 'POL' },
    { label: 'POLYNESIENNE', value: 'PYF' },
    { label: 'PORTORICAINE', value: 'PRI' },
    { label: 'PORTUGAISE', value: 'PRT' },
    { label: 'QATARI', value: 'QAT' },
    { label: 'REUNIONNAISE', value: 'REU' },
    { label: 'ROUMAINE', value: 'ROU' },
    { label: 'BRITANNIQUE', value: 'GBR' },
    { label: 'RUSSE', value: 'RUS' },
    { label: 'RWANDAISE', value: 'RWA' },
    { label: 'SAHRAOUI', value: 'ESH' },
    { label: 'DE SAINT-BARTHELEMY', value: 'BLM' },
    { label: 'DE SAINT-KITTS-ET-NEVIS', value: 'KNA' },
    { label: 'SAINT-MARINAISE', value: 'SMR' },
    { label: 'DE SAINT-MARTIN (PARTIE FRA)', value: 'MAF' },
    { label: 'DE SAINT-MARTIN (PARTIE NÉE)', value: 'SXM' },
    { label: 'SAINT-PIERRAISE, MIQUELONNAISE', value: 'SPM' },
    { label: 'DU VATICAN', value: 'VAT' },
    { label: 'SAINT-VINCENTAISE ET GRENADINE', value: 'VCT' },
    { label: 'DE STE-HEL., ASC., TRI. DA CUN', value: 'SHN' },
    { label: 'SAINTE-LUCIENNE', value: 'LCA' },
    { label: 'SALOMONIENNE', value: 'SLB' },
    { label: 'SAMOANE', value: 'WSM' },
    { label: 'SAMOANE AMERICAINE', value: 'ASM' },
    { label: 'SAO-TOMIENNE', value: 'STP' },
    { label: 'SERBE', value: 'SRB' },
    { label: 'SEYCHELLOISE', value: 'SYC' },
    { label: 'SINGAPOURIENNE', value: 'SGP' },
    { label: 'SLOVAQUE', value: 'SVK' },
    { label: 'SLOVENE', value: 'SVN' },
    { label: 'SOMALIENNE', value: 'SOM' },
    { label: 'SOUDANAISE', value: 'SDN' },
    { label: 'SUD-SOUDANAISE', value: 'SSD' },
    { label: 'SRI-LANKAISE', value: 'LKA' },
    { label: 'SUEDOISE', value: 'SWE' },
    { label: 'SUISSE', value: 'CHE' },
    { label: 'SURINAMAISE', value: 'SUR' },
    { label: 'DE SVALBARD, LILE JAN MAYEN', value: 'SJM' },
    { label: 'SWAZI', value: 'SWZ' },
    { label: 'SYRIENNE', value: 'SYR' },
    { label: 'TADJIK', value: 'TJK' },
    { label: 'TAIWANAISE', value: 'TWN' },
    { label: 'TANZANIENNE', value: 'TZA' },
    { label: 'TCHADIENNE', value: 'TCD' },
    { label: 'TCHEQUE', value: 'CZE' },
    { label: 'DES TERRES AUSTR. FRANÇAISES', value: 'ATF' },
    { label: 'THAILANDAISE', value: 'THA' },
    { label: 'EST-TIMORAISE', value: 'TLS' },
    { label: 'DE TOKELAU', value: 'TKL' },
    { label: 'TONGIENNE', value: 'TON' },
    { label: 'TRINITIENNE', value: 'TTO' },
    { label: 'TUNISIENNE', value: 'TUN' },
    { label: 'TURKMENE', value: 'TKM' },
    { label: 'DES ILES TURKS-ET-CAÏCOS', value: 'TCA' },
    { label: 'TURQUE', value: 'TUR' },
    { label: 'TUVALUAN', value: 'TUV' },
    { label: 'UKRAINIENNE', value: 'UKR' },
    { label: 'URUGUAYENNE', value: 'URY' },
    { label: 'VANUATAN', value: 'VUT' },
    { label: 'VENEZUELIENNE', value: 'VEN' },
    { label: 'VIETNAMIENNE', value: 'VNM' },
    { label: 'WALLISIENNE OU FUTUNIENNE', value: 'WLF' },
    { label: 'YEMENITE', value: 'YEM' },
    { label: 'ZAMBIENNE', value: 'ZMB' },
    { label: 'ZIMBABWEENNE', value: 'ZWE' },
  ]


  const countryoptions = [
    { label: 'CÔTE D’IVOIRE', value: 'CIV' },
    { label: 'BURKINA FASOr', value: 'BFA' },
    { label: 'BENIN', value: 'BEN' },
    { label: 'MALI', value: 'MLI' },
    { label: 'GUINÉE', value: 'GIN' },
    { label: 'NIGER', value: 'NER' },
    { label: 'SÉNÉGAL', value: 'SEN' },
    { label: 'TOGO', value: 'TGO' },
    { label: 'GHANA', value: 'GHA' },
    { label: 'LIBÉRIA', value: 'LBR' },
    { label: 'NIGÉRIA', value: 'NGA' },
    { label: 'CAMEROUN', value: 'CMR' },
    { label: 'MAURITANIE', value: 'MRT' },
    { label: 'CONGO-BRAZZAVILLE', value: 'COG' },
    { label: 'CONGO-KINSHASA', value: 'COD' },
    { label: 'GABON', value: 'GAB' },
    { label: 'CAP-VERT', value: 'CPV' },
    { label: 'SIERRA LEONE', value: 'SLE' },
    { label: 'GUINÉE ÉQUATORIALE', value: 'GNQ' },
    { label: 'GUINÉE-BISSAU', value: 'GNB' },
    { label: 'RÉPUBLIQUE CENTRAFRICAINE', value: 'CAF' },
    { label: 'AFGHANISTAN', value: 'AFG' },
    { label: 'AFRIQUE DU SUD', value: 'ZAF' },
    { label: 'ILES ALAND', value: 'ALA' },
    { label: 'ALBANIE', value: 'ALB' },
    { label: 'ALGERIE', value: 'DZA' },
    { label: 'ALLEMAGNE', value: 'DEU' },
    { label: 'ANDORRE', value: 'AND' },
    { label: 'ANGOLA', value: 'AGO' },
    { label: 'ANGUILLA', value: 'AIA' },
    { label: 'ANTARCTIQUE', value: 'ATA' },
    { label: 'ANTIGUA-ET-BARBUDA', value: 'ATG' },
    { label: 'ARABIE SAOUDITE', value: 'SAU' },
    { label: 'ARGENTINE', value: 'ARG' },
    { label: 'ARMENIE', value: 'ARM' },
    { label: 'ARUBA', value: 'ABW' },
    { label: 'AUSTRALIE', value: 'AUS' },
    { label: 'AUTRICHE', value: 'AUT' },
    { label: 'AZERBAIDJAN', value: 'AZE' },
    { label: 'BAHAMAS', value: 'BHS' },
    { label: 'BAHREIN', value: 'BHR' },
    { label: 'BANGLADESH', value: 'BGD' },
    { label: 'BARBADE', value: 'BRB' },
    { label: 'BIELORUSSIE', value: 'BLR' },
    { label: 'BELGIQUE', value: 'BEL' },
    { label: 'BELIZE', value: 'BLZ' },
    { label: 'BERMUDES', value: 'BMU' },
    { label: 'BHOUTAN', value: 'BTN' },
    { label: 'BOLIVIE', value: 'BOL' },
    { label: 'BONAIRE, SAINT-EUSTACHE ET SABA', value: 'BES' },
    { label: 'BOSNIE-HERZEGOVINE', value: 'BIH' },
    { label: 'BOTSWANA', value: 'BWA' },
    { label: 'ILE BOUVET', value: 'BVT' },
    { label: 'BRESIL', value: 'BRA' },
    { label: 'BRUNEI DARUSSALAM', value: 'BRN' },
    { label: 'BULGARIE', value: 'BGR' },
    { label: 'BURUNDI', value: 'BDI' },
    { label: 'ÎLES CAÏMANS', value: 'CYM' },
    { label: 'CAMBODGE', value: 'KHM' },
    { label: 'CANADA', value: 'CAN' },
    { label: 'CHILI', value: 'CHL' },
    { label: 'CHINE', value: 'CHN' },
    { label: 'ÎLE CHRISTMAS', value: 'CXR' },
    { label: 'CHYPRE', value: 'CYP' },
    { label: 'ÎLES COCOS (KEELING)', value: 'CCK' },
    { label: 'COLOMBIE', value: 'COL' },
    { label: 'COMORES', value: 'COM' },
    { label: 'ÎLES COOK', value: 'COK' },
    { label: 'CORÉE DU SUD', value: 'KOR' },
    { label: 'CORÉE DU NORD', value: 'PRK' },
    { label: 'COSTA RICA', value: 'CRI' },
    { label: 'CROATIE', value: 'HRV' },
    { label: 'CUBA', value: 'CUB' },
    { label: 'CURAÇAO', value: 'CUW' },
    { label: 'DANEMARK', value: 'DNK' },
    { label: 'DJIBOUTI', value: 'DJI' },
    { label: 'RÉPUBLIQUE DOMINICAINE', value: 'DOM' },
    { label: 'DOMINIQUE', value: 'DMA' },
    { label: 'ÉGYPTE', value: 'EGY' },
    { label: 'EL SALVADOR', value: 'SLV' },
    { label: 'ÉMIRATS ARABES UNIS', value: 'ARE' },
    { label: 'ÉQUATEUR', value: 'ECU' },
    { label: 'ÉRYTHRÉE', value: 'ERI' },
    { label: 'ESPAGNE', value: 'ESP' },
    { label: 'ESTONIE', value: 'EST' },
    { label: 'ÉTATS-UNIS', value: 'USA' },
    { label: 'ÉTHIOPIE', value: 'ETH' },
    { label: 'ÎLES FALKLAND (MALVINAS)', value: 'FLK' },
    { label: 'ÎLES FÉROÉ', value: 'FRO' },
    { label: 'FIDJI', value: 'FJI' },
    { label: 'FINLANDE', value: 'FIN' },
    { label: 'FRANCE', value: 'FRA' },
    { label: 'GAMBIE', value: 'GMB' },
    { label: 'GÉORGIE', value: 'GEO  ' },
    { label: 'GÉORGIE DU SUD-ET-LES ÎLES SANDWICH DU SUD', value: 'SGS' },
    { label: 'GIBRALTAR', value: 'GIB' },
    { label: 'GRÈCE', value: 'GRC' },
    { label: 'GRENADE', value: 'GRD' },
    { label: 'GROENLAND', value: 'GRL' },
    { label: 'GUADELOUPE', value: 'GLP' },
    { label: 'GUAM', value: 'GUM' },
    { label: 'GUATEMALA', value: 'GTM' },
    { label: 'GUERNESEY', value: 'GGY' },
    { label: 'GUYANA', value: 'GUY' },
    { label: 'GUYANE FRANÇAISE', value: 'GUF' },
    { label: 'HAÏTI', value: 'HTI' },
    { label: 'ÎLE HEARD-ET-ÎLES MACDONALD', value: 'HMD' },
    { label: 'HONDURAS', value: 'HND' },
    { label: 'HONG KONG', value: 'HKG' },
    { label: 'HONGRIE', value: 'HUN' },
    { label: 'ÎLE DE MAN', value: 'IMN' },
    { label: 'ÎLES MINEURES ÉLOIGNÉES DES ÉTATS-UNIS', value: 'UMI' },
    { label: 'ÎLES VIERGES BRITANNIQUES', value: 'VGB' },
    { label: 'ÎLES VIERGES DES ÉTATS-UNIS', value: 'VIR' },
    { label: 'INDE', value: 'IND' },
    { label: 'INDONÉSIE', value: 'IDN' },
    { label: 'IRAN', value: 'IRN' },
    { label: 'IRAQ', value: 'IRQ' },
    { label: 'IRLANDE', value: 'IRL' },
    { label: 'ISLANDE', value: 'ISL' },
    { label: 'ISRAËL', value: 'ISR' },
    { label: 'ITALIE', value: 'ITA' },
    { label: 'JAMAÏQUE', value: 'JAM' },
    { label: 'JAPON', value: 'JPN' },
    { label: 'JERSEY', value: 'JEY' },
    { label: 'JORDANIE', value: 'JOR' },
    { label: 'KAZAKHSTAN', value: 'KAZ' },
    { label: 'KENYA', value: 'KEN' },
    { label: 'KIRGHIZISTAN', value: 'KGZ' },
    { label: 'KIRIBATI', value: 'KIR' },
    { label: 'KOSOVO', value: 'XKO' },
    { label: 'KOWEÏT', value: 'KWT' },
    { label: 'LAOS', value: 'LAO' },
    { label: 'LESOTHO', value: 'LSO' },
    { label: 'LETTONIE', value: 'LVA' },
    { label: 'LIBAN', value: 'LBN' },
    { label: 'LIBYE', value: 'LBY' },
    { label: 'LIECHTENSTEIN', value: 'LIE' },
    { label: 'LITUANIE', value: 'LTU' },
    { label: 'LUXEMBOURG', value: 'LUX' },
    { label: 'MACAO', value: 'MAC' },
    { label: 'MACÉDOINE (ERYDM)', value: 'MKD' },
    { label: 'MADAGASCAR', value: 'MDG' },
    { label: 'MALAISIE', value: 'MYS' },
    { label: 'MALAWI', value: 'MWI' },
    { label: 'MALDIVES', value: 'MDV' },
    { label: 'MALTE', value: 'MLT' },
    { label: 'ÎLES MARIANNES DU NORD', value: 'MNP' },
    { label: 'MAROC', value: 'MAR' },
    { label: 'ÎLES MARSHALL', value: 'MHL' },
    { label: 'MARTINIQUE', value: 'MTQ' },
    { label: 'MAURICE', value: 'MUS' },
    { label: 'MAYOTTE', value: 'MYT' },
    { label: 'MEXIQUE', value: 'MEX' },
    { label: 'ÉTATS FÉDÉRÉS DE MICRONÉSIE', value: 'FSM' },
    { label: 'MOLDOVA', value: 'MDA' },
    { label: 'MONACO', value: 'MCO' },
    { label: 'MONGOLIE', value: 'MNG' },
    { label: 'MONTÉNÉGRO', value: 'MNE' },
    { label: 'MONTSERRAT', value: 'MSR' },
    { label: 'MOZAMBIQUE', value: 'MOZ' },
    { label: 'MYANMAR', value: 'MMR' },
    { label: 'NAMIBIE', value: 'NAM' },
    { label: 'NAURU', value: 'NRU' },
    { label: 'NÉPAL', value: 'NPL' },
    { label: 'NICARAGUA', value: 'NIC' },
    { label: 'NIUE', value: 'NIU' },
    { label: 'ÎLE NORFOLK', value: 'NFK' },
    { label: 'NORVÈGE', value: 'NOR' },
    { label: 'NOUVELLE-CALÉDONIE', value: 'NCL' },
    { label: 'NOUVELLE-ZÉLANDE', value: 'NZL' },
    { label: 'TERRITOIRE BRITANNIQUE DE L’OCÉAN INDIEN', value: 'IOT' },
    { label: 'OMAN', value: 'OMN' },
    { label: 'OUGANDA', value: 'UGA' },
    { label: 'OUZBÉKISTAN', value: 'UZB' },
    { label: 'PAKISTAN', value: 'PAK' },
    { label: 'PALAOS', value: 'PLW' },
    { label: 'ÉTAT DE PALESTINE', value: 'PSE' },
    { label: 'PANAMA', value: 'PAN' },
    { label: 'PAPOUASIE-NOUVELLE-GUINÉE', value: 'PNG' },
    { label: 'PARAGUAY', value: 'PRY' },
    { label: 'PAYS-BAS', value: 'NLD' },
    { label: 'PÉROU', value: 'PER' },
    { label: 'PHILIPPINES', value: 'PHL' },
    { label: 'PITCAIRN', value: 'PCN' },
    { label: 'POLOGNE', value: 'POL' },
    { label: 'POLYNÉSIE FRANÇAISE', value: 'PYF' },
    { label: 'PORTO RICO', value: 'PRI' },
    { label: 'PORTUGAL', value: 'PRT' },
    { label: 'QATAR', value: 'QAT' },
    { label: 'RÉUNION', value: 'REU' },
    { label: 'ROUMANIE', value: 'ROU' },
    { label: 'ROYAUME-UNI', value: 'GBR' },
    { label: 'RUSSIE', value: 'RUS' },
    { label: 'RWANDA', value: 'RWA' },
    { label: 'SAHARA OCCIDENTAL', value: 'ESH' },
    { label: 'SAINT-BARTHÉLEMY', value: 'BLM' },
    { label: 'JSAINT-KITTS-ET-NEVISAPON', value: 'KNA' },
    { label: 'SAINT-MARIN', value: 'SMR' },
    { label: 'SAINT-MARTIN (PARTIE FRANÇAISE)', value: 'MAF' },
    { label: 'SAINT-MARTIN (PARTIE NÉERLANDAISE)', value: 'SXM' },
    { label: 'SAINT-PIERRE-ET-MIQUELON', value: 'SPM' },
    { label: 'ÉTAT DE LA CITÉ DU VATICAN', value: 'VAT' },
    { label: 'SAINT-VINCENT-ET-LES GRENADINES', value: 'VCT' },
    { label: 'SAINTE-HÉLÈNE, ASCENSION ET TRISTAN DA CUNHA', value: 'SHN' },
    { label: 'SAINTE-LUCIE', value: 'LCA' },
    { label: 'ÎLES SALOMON', value: 'SLB' },
    { label: 'SAMOA', value: 'WSM' },
    { label: 'SAMOA AMÉRICAINESDA', value: 'ASM' },
    { label: 'SAO TOMÉ-ET-PRINCIPE', value: 'STP' },
    { label: 'SERBIE', value: 'SRB' },
    { label: 'SEYCHELLES', value: 'SYC' },
    { label: 'SINGAPOUR', value: 'SGP' },
    { label: 'SLOVAQUIE', value: 'SVK' },
    { label: 'SLOVÉNIE', value: 'SVN' },
    { label: 'SOMALIE', value: 'SOM' },
    { label: 'SOUDAN', value: 'SDN' },
    { label: 'SOUDAN DU SUD', value: 'SSD' },
    { label: 'SRI LANKA', value: 'LKA' },
    { label: 'SUÈDE', value: 'SWE' },
    { label: 'SUISSE', value: 'CHE' },
    { label: 'SURINAME', value: 'SUR' },
    { label: 'SVALBARD ET ÎLE JAN MAYEN', value: 'SJM' },
    { label: 'SWAZILAND ', value: 'SWZ' },
    { label: 'SYRIE', value: 'SYR' },
    { label: 'TADJIKISTAN', value: 'TJK' },
    { label: 'TAÏWAN', value: 'TWN' },
    { label: 'TANZANIE', value: 'TZA' },
    { label: 'TCHAD', value: 'TCD' },
    { label: 'RÉPUBLIQUE TCHÈQUE', value: 'CZE' },
    { label: 'TERRES AUSTRALES FRANÇAISES', value: 'ATF' },
    { label: 'THAÏLANDE', value: 'THA' },
    { label: 'TIMOR-LESTE', value: 'TLS' },
    { label: 'TOKELAU', value: 'TKL' },
    { label: 'TONGA', value: 'TON' },
    { label: 'TRINITÉ-ET-TOBAGO', value: 'TTO' },
    { label: 'TUNISIE', value: 'TUN' },
    { label: 'TURKMÉNISTAN', value: 'TKM' },
    { label: 'ÎLES TURKS-ET-CAÏCOS', value: 'TCA' },
    { label: 'TURQUIE', value: 'TUR' },
    { label: 'TUVALU', value: 'TUV' },
    { label: 'UKRAINE', value: 'UKR' },
    { label: 'URUGUAY', value: 'URY' },
    { label: 'VANUATU', value: 'VUT' },
    { label: 'VENEZUELA', value: 'VEN' },
    { label: 'VIET NAM', value: 'VNM' },
    { label: 'WALLIS-ET-FUTUNA', value: 'WLF' },
    { label: 'YÉMEN', value: 'YEM' },
    { label: 'ZAMBIE', value: 'ZMB' },
    { label: 'ZIMBABWE', value: 'ZWE' },
  
  ];

  const approval = [
    { label: 'True', value: 'true' },
    { label: 'False', value: 'false' },
    
  ];

  const personcat = [
    { label: 'Fonctionnaire civil', value: 'FCI' },
    { label: 'Militaire', value: 'MIL' },

    { label: 'Retraité(e ) CGRAE', value: 'REP' },
    { label: 'Salarié(e )', value: 'SAL' },

    { label: 'Retraité(e ) CNPS', value: 'RET' },
    { label: 'Profession libérale', value: 'LIB' },

    { label: 'Travailleur indépendant', value: 'TIN' },
    { label: 'Indigent(e )', value: 'IND' },

    { label: 'Elève', value: 'ELE' },
    { label: 'Etudiant(e )', value: 'ETU' },

    { label: 'Femme au foyer', value: 'FEF' },
    { label: 'Autre ayant-droit à charge', value: 'AUA' },

    { label: 'Chômeur', value: 'CHO' },
    { label: 'Autre ouvrant-droit', value: 'AUO' },
    
  ];


  //console.log('test',cnapprove)
  
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  

  const handleFilterChange = (event) => {
    
    const {
      target: { value },
    } = event;
    
    setCnamfilter(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );   
  };
  const handleChange = useCallback();
  // const handleChange = useCallback(
  //   (index, passwordEnabled) => {
  //     setUserListData(prev => {
  //       const prevUserList = [...prev];
  //       prevUserList[index].passwordEnabled = !passwordEnabled;
  //       return prevUserList;
  //     });
  //     getSingleUser({
  //       accessToken,
  //       mobileNumber: userListData[index]?.mobileNumber,
  //     }).then(res => {
  //       console.log("res", res);
  //       const identityNumber = res.data?.data?.content[0]?.identityNumber;
  //       UpdateUserApi(identityNumber, {
  //         passwordEnabled: !passwordEnabled,
  //       });
  //     });
  //   },
  //   [UpdateUserApi, accessToken, getSingleUser, userListData],
  // );

  const navigate = useNavigate();
  // ! Displaying  BranchId as BranchName
  // const branchesMap = useMemo(
  //   () =>
  //     branches?.reduce((acc, branch) => {
  //       acc[branch?.value] = branch?.label;
  //       return acc;
  //     }, {}) || {},
  //   [branches],
  // );

  const json = userListData2;

  const addStyles = useCallback((workbookBlob, dataInfo) => {
    return XlsxPopulate.fromDataAsync(workbookBlob).then(workbook => {
      workbook.sheets().forEach(sheet => {
        sheet.column("A").width(10);
        sheet.column("B").width(15);
        sheet.column("C").width(15);
        sheet.column("D").width(15);
        sheet.column("E").width(15);
        sheet.column("F").width(15);
        sheet.column("G").width(15);
        sheet.column("H").width(15);

        sheet.range(dataInfo.titleRange).style({
          bold: true,
        });
      });
      return workbook
        .outputAsync()
        .then(workbookBlob => URL.createObjectURL(workbookBlob));
    });
  }, []);

  // #2
  const s2ab = useCallback(s => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i);
    }

    return buf;
  }, []);

  const workbook2blob = useCallback(
    workbook => {
      const wopts = {
        bookType: "xlsx",
        type: "binary",
      };
      const wbout = XLSX.write(workbook, wopts);

      const blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream",
      });
      return blob;
    },
    [s2ab],
  );
  // #3
  // const handleExport = useCallback(() => {})
  const handleExport = useCallback(() => {
    // const Filterss = [
    //   {
    //     A:
    //       search.length !== 0
    //         ? `${
    //           selectedFilter === "branchId"
    //             ? "Branch Name"
    //             : selectedFilter === "mobileNumber"
    //             ? "Mobile Number"
    //             : selectedFilter === "district"
    //             ? "District"
    //             : selectedFilter === "name"
    //             ? "Name"
    //             : selectedFilter
    //         } : ${
    //           selectedFilter === "branchId"
    //             ? branches.find(dem => dem.value === search).label
    //             : search
    //         }`
    //         : null,
    //   },
    // ];
    const Datee = [
      {
        A: ` Date Period : ${
          fromDate === "" ? "2023-01-01" : moment(fromDate).format("YYYY-MM-DD")
        } To ${
          toDate === ""
            ? moment(new Date()).format("YYYY-MM-DD")
            : moment(toDate).format("YYYY-MM-DD")
        }`,
      },
    ];

    // const Clientt = [
    //   {
    //     A: `Client : ${Type.split(" ")
    //       .map(word => word[0]?.toUpperCase() + word.substring(1).toLowerCase())
    //       .join(" ")}`,
    //   },
    // ];

    // const Channell = [
    //   {
    //     A: `Channel : ${Channel.split(" ")
    //       .map(word => word[0]?.toUpperCase() + word.substring(1).toLowerCase())
    //       .join(" ")}`,
    //   },
    // ];

    const TimeStampp = [
      { A: ` Timestamp : ${moment(new Date()).format("hh:mm:ss A")}` },
    ];
    // const Role = [{ A: roleSearch.length !== 0 ? `ROLE : ${roleSearch}` : null }];
    let table1 = [
      {
        A: "Serial No",
        B: "Enrollment ID",
        C: "First Name",
        D: "Last Name",
        E: "Date Of Birth",
        F: "Nationality",
        G: "Person Category",
        H: "Started At",
        I: "Completed At"
      },
    ];

    csvFile.forEach(row => {
      table1.push({
        // A: row.serial,
        // B: row.displayName,
        // C: row.mobileNumber,
        // D: row.role,
        // E: row.branchName,
        // F: row.status,
        // G: row.lastLogin,
        // H: row.createdAt,
        // I: row.updatedBy,
        // J: row.updatedAt,
        // K: row.updatedBy,
        A:row.id,
        B: row.enrolmentId,
        C:row.firstName,
        D:row.lastName,
        E:row.dateOfBirth,
        F:row.nationality,
        G:row.personCategory,
        H:row.startedAt,
        I:row.completedAt,
      });
    });

    const finalData = [
      { A: "CNAM Enrollments" },
      {},
      // ...Role,
      // ...Filterss,
      // ...Clientt,
      // ...Channell,
      ...Datee,
      ...TimeStampp,
      {},
      {},
      ...table1,
    ];
    // Create a workbook
    const wb = XLSX.utils.book_new();
    // Create a worksheet
    const sheet = XLSX.utils.json_to_sheet(finalData, {
      skipHeader: true,
    });

    const dataInfo = {
      titleCell: "A1",
      titleRange: "A1:K2",
      tbodyRange: `A11:K${finalData.length}`,
    };

    XLSX.utils.book_append_sheet(wb, sheet, "CNAM_Enrollments");

    const workbookBlob = workbook2blob(wb);

    const headerIndexes = [];
    finalData.forEach((data, index) =>
      data["A"] === "Serial No" ? headerIndexes.push(index) : null,
    );

    return addStyles(workbookBlob, dataInfo);
  }, [
    // Channel,
    // Type,
    addStyles,
    csvFile,
    fromDate,
    roleSearch,
    search,
    selectedFilter,
    toDate,
    workbook2blob,
  ]);

  // #4
  const createDownloadData = useCallback(() => {
    handleExport().then(url => {
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", url);
      downloadAnchorNode.setAttribute("download", "CNAM_Enrollments.xlsx");
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    });
  }, [handleExport]);


  // const handleSubmit = e => {
  // }


  const handleSubmit = e => {
    e.preventDefault();
    // console.log(userListData2)
    const pdf = new jsPDF("landscape");

    const columns = PDFDate.map(fields => fields.label);
    var rows = [];

    for (let i = 0; i < json.length; i++) {
      var temp = [
        json[i]?.id,
        json[i]?.enrolmentId,
        json[i]?.firstName,
        json[i]?.lastName,
        json[i]?.dateOfBirth,
        json[i]?.nationality,
        json[i]?.personCategory,
        json[i]?.startedAt,
        json[i]?.completedAt,
        // json[i].passwordEnabled,
      ];
      rows.push(temp);
    }
    // pdf.autoTable(columns, rows, {
    //   startY: 75,
    //   margin: {
    //     right: 2,
    //     top: 75,
    //     left: 8.5,
    //   },
    //   didDrawPage: function (data) {
    //     // Header
    //     pdf.addImage(logo, "PNG", 100, 10, 100, 25);
    //     pdf.setLineWidth(0.2);
    //     pdf.rect(8.5, 45, 280, 28);

    //     pdf.setFontSize(11);
    //     pdf.text(`Date : ${moment(new Date()).format("DD-MM-YYYY")}`, 250, 50);

    //     pdf.setFontSize(11);
    //     if (search.length) {
    //       pdf.text(
    //         `${
    //           selectedFilter === "branchId"
    //             ? "Branch Name"
    //             : selectedFilter === "mobileNumber"
    //             ? "Mobile Number"
    //             : selectedFilter === "district"
    //             ? "District"
    //             : selectedFilter === "name"
    //             ? "Name"
    //             : selectedFilter
    //         } : ${
    //           selectedFilter === "branchId"
    //             ? branches.find(dem => dem.value === search).label
    //             : search
    //         }`,
    //         11.5,
    //         60,
    //       );
    //     }
    //     if (roleSearch.length) {
    //       pdf.text(
    //         `${roleFilter === "role" ? "Role" : "Role"} : ${
    //           roleFilter === "role" ? roleSearch : null
    //         }`,
    //         11.5,
    //         70,
    //       );
    //     }

    //     if (fromDate && toDate) {
    //       pdf.setFontSize(11);
    //       pdf.text(
    //         `Date Period : ${moment(fromDate).format("DD-MM-YYYY")} To ${moment(
    //           toDate,
    //         ).format("DD-MM-YYYY")}`,
    //         11.5,
    //         50,
    //       );
    //     }
    //     if (!fromDate && !toDate) {
    //       pdf.setFontSize(11);
    //       pdf.text(
    //         `Date Period : 01-01-2023 To ${moment(new Date()).format(
    //           "DD-MM-YYYY",
    //         )}`,
    //         11.5,
    //         50,
    //       );
    //     }
    //     pdf.setFontSize(10);
    //     pdf.text(
    //       `Generated by : ${roleName
    //         .split("_")
    //         .join(" ")
    //         .split(" ")
    //         .map(
    //           word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
    //         )
    //         .join(" ")} (${reportingRoleName
    //         .split("_")
    //         .join(" ")
    //         .split(" ")
    //         .map(
    //           word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
    //         )
    //         .join(" ")})`,
    //       11.5,
    //       200,
    //     );
    //     pdf.setFontSize(10);
    //     pdf.text(
    //       `Timestamp : ${moment(new Date()).format("DD-MM-YY hh:mm:ss A")}`,
    //       210,
    //       200,
    //     );
    //     // Footer
    //     let str = "Page No " + pdf.internal.getNumberOfPages();
    //     pdf.setFontSize(10);

    //     // jsPDF 1.4+ uses getWidth, <1.4 uses .width
    //     let pageSize = pdf.internal.pageSize;
    //     let pageHeight = pageSize.height
    //       ? pageSize.height
    //       : pageSize.getHeight();
    //     // pdf.text('index+1', data.settings.margin.left+250, pageHeight - 10);
    //     pdf.text(str, data.settings.margin.left + 125, pageHeight - 5);
    //   },

    //   columnStyles: {
    //     0: { cellWidth: 15 },
    //     1: { cellWidth: 30 },
    //     2: { cellWidth: 30 },
    //     3: { cellWidth: 35 },
    //     4: { cellWidth: 20 },
    //     5: { cellWidth: 30 },
    //     6: { cellWidth: 30 },
    //     7: { cellWidth: 20 },
    //     8: { cellWidth: 30 },
    //     9: { cellWidth: 20 },
    //     10: { cellWidth: 20 },
    //   },
    //   theme: "grid",
    //   styles: {
    //     font: "times",
    //     overflow: "linebreak",
    //     align: "left",
    //     cellPadding: 2,
    //     lineWidth: 0.2,
    //     lineColor: [0, 0, 0],
    //     textColor: [0, 0, 0],
    //   },
    //   headStyles: {
    //     textColor: [0, 0, 0],
    //     fontStyle: "normal",
    //     lineWidth: 0.2,
    //     lineColor: [0, 0, 0],
    //     fillColor: [244, 182, 47],
    //   },
    //   alternateRowStyles: {
    //     fillColor: [222, 222, 222],
    //     textColor: [0, 0, 0],
    //     lineWidth: 0.2,
    //     lineColor: [0, 0, 0],
    //   },

    //   tableLineColor: [0, 0, 0],
    // });
    
    pdf.autoTable(columns, rows, {
      startY: 85,
      margin: {
        right: 2,
        top: 85,
        left: 8.5,
      },
      didDrawPage: function (data) {
        // Header
        // pdf.addImage(logo, "PNG", 100, 10, 100, 25);
        // pdf.addImage(logo, "PNG", 111, -10, 70, 65);
        pdf.addImage(logo, "PNG", 120, 0, 50, 45);

        pdf.setLineWidth(0.2);
        pdf.rect(8.5, 45, 280, 38);

        pdf.setFontSize(14);
        pdf.text('CNAM Enrolments',130,50)
        pdf.setFontSize(11);
        pdf.text(`Date : ${moment(new Date()).format("DD-MM-YYYY")}`, 250, 60);
        // pdf.setFontSize(11);
        // pdf.text(
        //   `Channel : ${Channel.split(" ")
        //     .map(
        //       word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
        //     )
        //     .join(" ")}`,
        //   250,
        //   70,
        // );
        //pdf.setFontSize(11);
        // pdf.text(
        //   `Client : ${Type.split(" ")
        //     .map(
        //       word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
        //     )
        //     .join(" ")}`,
        //   250,
        //   80,
        // );
        // pdf.setFontSize(11);
        // if (search.length) {
        //   pdf.text(
        //     `${
        //       selectedFilter === "branchId"
        //         ? "Branch Name"
        //         : selectedFilter === "mobileNumber"
        //         ? "Mobile Number"
        //         : selectedFilter === "district"
        //         ? "District"
        //         : selectedFilter === "name"
        //         ? "Name"
        //         : selectedFilter
        //     } : ${
        //       selectedFilter === "branchId"
        //         ? branches.find(dem => dem.value === search).label
        //         : search
        //     }`,
        //     11.5,
        //     70,
        //   );
        // }
        // if (roleSearch.length) {
        //   pdf.text(
        //     `${roleFilter === "role" ? "Role" : "Role"} : ${
        //       roleFilter === "role" ? roleSearch : null
        //     }`,
        //     11.5,
        //     80,
        //   );
        // }

        if (fromDate && toDate) {
          pdf.setFontSize(11);
          pdf.text(
            `Date Period : ${moment(fromDate).format("DD-MM-YYYY")} To ${moment(
              toDate,
            ).format("DD-MM-YYYY")}`,
            11.5,
            60,
          );
        }
        if (!fromDate && !toDate) {
          pdf.setFontSize(11);
          pdf.text(
            `Date Period : 01-01-2023 To ${moment(new Date()).format(
              "DD-MM-YYYY",
            )}`,
            11.5,
            60,
          );
        }
        // pdf.setFontSize(10);
        // pdf.text(
        //   `Generated by : ${roleName
        //     .split("_")
        //     .join(" ")
        //     .split(" ")
        //     .map(
        //       word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
        //     )
        //     .join(" ")} (${reportingRoleName
        //     .split("_")
        //     .join(" ")
        //     .split(" ")
        //     .map(
        //       word => word[0]?.toUpperCase() + word.substring(1).toLowerCase(),
        //     )
        //     .join(" ")})`,
        //   11.5,
        //   200,
        // );
        pdf.setFontSize(11);
        pdf.text(
          `Timestamp : ${moment(new Date()).format("hh:mm:ss A")}`,
          240,
          200,
        );
        // Footer
        let str = "Page No " + pdf.internal.getNumberOfPages();
        pdf.setFontSize(10);

        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
        let pageSize = pdf.internal.pageSize;
        let pageHeight = pageSize.height
          ? pageSize.height
          : pageSize.getHeight();
        // pdf.text('index+1', data.settings.margin.left+250, pageHeight - 10);
        pdf.text(str, data.settings.margin.left + 125, pageHeight - 5);
      },

      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 35 },
        2: { cellWidth: 45 },
        3: { cellWidth: 35 },
        4: { cellWidth: 25 },
        5: { cellWidth: 20 },
        6: { cellWidth: 20 },
        7: { cellWidth: 40 },
        8: { cellWidth: 40 },
        9: { cellWidth: 10 }
      },
      theme: "grid",
      styles: {
        font: "times",
        overflow: "linebreak",
        align: "left",
        cellPadding: 2,
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0],
      },
      headStyles: {
        textColor: [255, 255, 255],
        fontStyle: "normal",
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
        fillColor: [0, 52, 120],
      },
      alternateRowStyles: {
        fillColor: [222, 222, 222],
        textColor: [0, 0, 0],
        lineWidth: 0.2,
        lineColor: [0, 0, 0],
      },

      tableLineColor: [0, 0, 0],
    });
    
    
    
       pdf.save("CNAM_Enrolments");
  };
  // useEffect(() => {
  //   setSearch("");
  // }, [selectedFilter, setSearch]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
      axios
        .get("/api/management/enrolment", {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${login?.data?.accessToken}`,
          },
          params: {
            pageNumber: pageNumber + 1,
            pageSize,
            fromDate: !fromDate ?'2023-01-01': moment(fromDate).format("YYYY-MM-DD") ,
            toDate: !toDate ? moment().format("YYYY-MM-DD") :moment(toDate).format("YYYY-MM-DD"),
            dateRangeProperty:'COMPLETED_AT',
            ...(cngender && {
              gender:cngender
            }),
            ...(cnapprove && {
              approvalRequired:cnapprove
            }),

            ...(cnationality && {
              nationality:cnationality
            }),

            ...(cpercate  && {
              personCategory:cpercate
            }),
            ...(search && {
              [selectedFilter]:
                selectedFilter === "mobileNumber" ? `+251${search}` : search,
            }),
            ...(roleSearch && {
              [roleFilter]: roleSearch,
            }),
          },
        })
        .then(res => {
          const { content, totalSize } = res?.data?.data?.results;

          setTotalSize(totalSize);

          axios
            .get("/api/management/enrolment", {
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${login?.data?.accessToken}`,
              },
              params: {
                pageNumber: 1,
                pageSize:res?.data?.data?.results?.totalSize === 0 ? 10 : res.data.data.results.totalSize,
                fromDate: !fromDate ?'2023-01-01': moment(fromDate).format("YYYY-MM-DD") ,
                toDate: !toDate ? moment().format("YYYY-MM-DD") :moment(toDate).format("YYYY-MM-DD"),
                dateRangeProperty:'COMPLETED_AT',
                ...(cngender && {
                  gender:cngender
                }),
                ...(cnapprove && {
                  approvalRequired:cnapprove
                }),
    
                ...(cnationality && {
                  nationality:cnationality
                }),
    
                ...(cpercate  && {
                  personCategory:cpercate
                }),
                ...(search && {
                  [selectedFilter]:
                    selectedFilter === "mobileNumber"
                      ? `+251${search}`
                      : search,
                }),
                ...(roleSearch && {
                  [roleFilter]: roleSearch,
                }),
              },
            })
            .then(res => {
              const { content } = res.data.data?.results;

              const trimmedData = res?.data?.data?.results?.content.map(
                ({
                enrolmentId,
                 firstName,
                 lastName,
                 dateOfBirth,
                 nationality ,
                 personCategory ,
                 startedAt,
                 completedAt ,
                 approvalRequired,
                 approvalStatus,
                 approvedStatusUpdatedAt,
                 processedAt
                }, index) => {
                  return {
                    id:index+1,
                 enrolmentId,
                 firstName,
                 lastName,
                 dateOfBirth,
                 nationality ,
                 personCategory ,
                 startedAt,
                 completedAt ,
                 approvalRequired,
                 approvalStatus,
                 approvedStatusUpdatedAt,
                 processedAt ,
                  };
                },
              );
              setCsvFile(trimmedData);
              setUserListData2(trimmedData);
              setSelectedRows(trimmedData);
            })
            .catch(error => {
              // toast.error(`${error?.response?.data?.error?.message}`);
            })
            .finally(() => {
              setIsLoading(false);
            });
          const trimmedData = res?.data?.data?.results?.content.map(
            ({
            enrolmentId,
             firstName,
             lastName,
             dateOfBirth,
             nationality ,
             personCategory ,
             startedAt,
             completedAt ,
             approvalRequired,
             approvalStatus,
             approvedStatusUpdatedAt,
             processedAt,
            }) => {
              return {
             enrolmentId,
             firstName,
             lastName,
             dateOfBirth,
             nationality ,
             personCategory ,
             startedAt,
             completedAt ,
             approvalRequired,
             approvalStatus,
             approvedStatusUpdatedAt,
             processedAt ,
              };
            },
          );
          
          setUserListData(trimmedData);
          
        })
        .catch(error => {
          toast.error(`${error?.response?.data?.error?.message}`);
          setIsLoading(false);
        });
  }, [
    // accessToken,
    // branchDistrict,
    // branchId,
    fromDate,
    pageNumber,
    pageSize,
    // reportingRoleName,
    search,
    refresh,

    // selectedFilter,
    toDate,
    roleFilter, roleSearch,cngender,cnapprove,cnationality,cpercate
  ]);

  const handleChangePage = useCallback((_event, newPage) => {
    setPageNumber(newPage);
  }, []);
  const handleChangeRowsPerPage = useCallback(e => {
    setPageSize(parseInt(e.target.value, 10));
    setPageNumber(0);
  }, []);

useEffect(()=>{
  const userAgent = navigator.userAgent;
  console.log(userAgent);
},[])
// const handleApprove = useCallback(
//   id => {
//     setIsLoading(true);
//     axios
//       .patch(
//         `/api/management/enrolment/${id}`,
//         {
//           approvalStatus: 'APPROVED',
//         },
//         {
//           headers: {
//             "content-type": "application/json",
//             authorization: `Bearer ${login?.data?.accessToken}`,
//           },
//         },
//       )
//       .then((res) => {
//         if(res.data?.data?.code === 'E500-00-001'){
//           setRefresh(prev => !prev);
//           toast.error("server error, please try again later");
//         }
//         else{
//           toast.success("Approved Successfully");
//         }
//         setIsLoading(false);
//       }).catch(err=>{
//         setIsLoading(false);
//         toast.error("error occured, please try again later");
//       });
//   },
//   [login?.data?.accessToken],
// );
// const handleReject = useCallback(
//   id => {
//     setIsLoading(true);
//     axios
//       .patch(
//         `/api/management/enrolment/${id}`,
//         {
//           approvalStatus: 'REJECTED',
//         },
//         {
//           headers: {
//             "content-type": "application/json",
//             authorization: `Bearer ${login?.data?.accessToken}`,
//           },
//         },
//       )
//       .then((res) => {
//         if(res.data?.data?.code === 'E500-00-001'){
//           setRefresh(prev => !prev);
//           toast.error("server error, please try again later");
//         }
//         else{
//           toast.success("Rejected Successfully");
//         }
//         setIsLoading(false);
//       }).catch(err=>{
//         setIsLoading(false);
//         toast.error("error occured");
//       });
//   },
//   [login?.data?.accessToken],
// );
  return (
    <>
    <Box height={"auto"} sx={{marginBottom:2}}>
    <Paper elevation={5} sx={{ p: 2 }}>
    
    <Box display={'flex'} justifyContent={'space-between'} direction={'row'} spacing={1} flexWrap="wrap">
              <Box>
              <Typography
                fontWeight={600}
                fontSize={{ xs: 18, md: 18, lg: 21 }}
                sx={{
                  // position: "relative",
                  // "&.MuiTypography-root::before ": {
                  //   content: "''",
                  //   position: "absolute",
                  //   height: 0.05,
                  //   width: { xs: 0.20, md: 0.1 },
                  //   backgroundColor: "#36454F",
                  //   left: 0,
                  //   right: -70,
                  //   bottom: -1,
                  // },
                  width:'120%',
                  borderBottom:'2px solid black'
                }}
              >
                Filters
              </Typography>
              </Box>
              <Typography display={'none'}>
                
              </Typography>
            </Box>
      
    <Stack gap={2} direction="row" flexWrap="Wrap" pt={1}   sx={{marginTop:1}}>
    <FormControl  size="small">
    <InputLabel id="demo-simple-select-autowidth-label">Select Filters</InputLabel>
    <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={cnamfilter}
          onChange={handleFilterChange}
          // input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
          renderValue={(selected) => selected.join(', ')}
          label="Select Filters"
          sx={{width:200}}
          // size="small"
          // sx={{'height':'2rem'}}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              size='small'
            >
              <Checkbox checked={cnamfilter.includes(name)}/>{name}
            </MenuItem>
          ))}
        </Select>
</FormControl>
       {cnamfilter?.includes('Gender') ? 
       <MuiAuto
       size="small"
       disablePortal
       id="combo-box-demo"
       options={genderoptions}
       onChange={(event, value) => setCngender(value?.value)}
       sx={{ width: 200, }}
       renderInput={(params) => <TextField {...params} label="gender" />}
     /> : ''}

      
{cnamfilter?.includes('Nationality') ? 
        <MuiAuto
        size="small"
       disablePortal
       id="combo-box-demo"
       options={nationalityoptions}
       onChange={(event, value) => setCnationality(value?.value)}
       sx={{ width: 200, }}
       renderInput={(params) => <TextField {...params} label="Nationality" />}
     /> : "" }

{cnamfilter?.includes('ApprovalRequired') ? 
        <MuiAuto
        size="small"
              disablePortal
              id="combo-box-demo"
              onChange={(event, value) => setCnapprove(value?.value)}
              options={approval}
              sx={{ width: 200, }}
              renderInput={(params) => <TextField {...params} label="ApprovalRequired" />}
            /> : ''}

      
   
{cnamfilter?.includes('PersonCategory') ? 
      <MuiAuto
      size="small"
       disablePortal
       id="combo-box-demo"
       options={personcat}
       onChange={(event, value) => setCpercate(value?.value)}
       sx={{ width: 200, }}
       renderInput={(params) => <TextField {...params} label="Person Category" />}
     /> : ''}

    </Stack>

    </Paper>
    </Box>
    
    <Box>
    <Paper elevation={5} sx={{ p: 2 }}>
      
      <Stack
        alignItems='flex-end'
        justifyContent='flex-end'
        mb={2}
        gap={2}
        direction='row'
      >
        <Typography variant='h6' color={theme.palette.primary.main}>
          EXPORT as
        </Typography>

        <Button
          sx={{ borderColor: "black", color: "black" }}
          variant='outlined'
          // disabled={active}
          onClick={handleSubmit}
        >
          PDF
        </Button>
        <Worker workerUrl='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js'>
          <div
            style={{
              alignItems: "center",
              backgroundColor: "#eeeeee",
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              display: "none",
              justifyContent: "center",
            }}
          ></div>
        </Worker>
        <Button
      sx={{ borderColor: "black", color: "black" }}
      variant='outlined'
      onClick={() => createDownloadData()}
    >
      CSV
    </Button>
      </Stack>
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          maxHeight: "calc(100vh - 200px)",
          minWidth: 250,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ height: "5%" }}>
              
              {columns.map(cell => (
                <TableCell
                  key={cell.headerName}
                  align='center'
                  style={{'width':cell.width,whiteSpace:'noWrap'}}
                  sx={{ backgroundColor: "#EFF2F7" }}
                >
                  {cell.headerName}
                </TableCell>
              ))}
                {/* <TableCell
                align='center'
                sx={{ backgroundColor: "#EFF2F7" }}
                width='5%'
              >
                EDIT
              </TableCell>
              <TableCell
                align='center'
                sx={{ backgroundColor: "#EFF2F7" }}
                width='5%'
              >
                Approve/Reject
              </TableCell> */}
              {/* <TableCell
                align='center'
                sx={{ backgroundColor: "#EFF2F7" }}
                width='5%'
              >
                PASSWORD
              </TableCell> */}
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2}>
                  <Typography p={5} textAlign='center'>
                    <CircularProgress />
                  </Typography>
                </TableCell>
              </TableRow>
            ) : userListData.length ? (
              userListData.map((user, index) => (
                <TableRow key={user.id}  onClick={() => {
                  navigate(
                    `/enrollments/edit/${user.enrolmentId}/${user.approvalRequired}/${user.approvalStatus}`,
                  );
                }} style={{'cursor':'pointer'}}>
                 
                  {columns.map(({ field, width }) => 
                    {return ( field === 'approvalRequired' ?<TableCell
                    key={field}
                    component='th'
                    scope='row'
                    align='center'
                    style={{width:field.width, whiteSpace: 'normal', overflowWrap: 'break-word'}}
                  >
                    {user?.approvalRequired ? 'true': 'false'}
                  </TableCell> : <TableCell
                      key={field}
                      // component='th'
                      // scope='row'
                      align='center'
                      style={{width:field.width, whiteSpace: 'normal'}}
                    >
                      {user[field]}
                    </TableCell>)}
                  )}
                     {/* <TableCell align='center'>
                    <Tooltip
                      title='EDIT'
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                    >
                      <IconButton
                       disabled={user?.approvalRequired===false}
                        aria-label='edit'
                        size='small'
                        onClick={() => {
                          navigate(
                            `/enrollments/edit/${user.enrolmentId}`,
                          );
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align='center'>
                  <Stack flexDirection="row" gap={3}>
                  <Tooltip
                      title='APPROVE'
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                    >
                    <Button
                      variant="contained"
                      size="small"
                      color="green"
                      disabled={user?.approvalRequired===false}
                      onClick={() => handleApprove(user?.enrolmentId)}
                    >
                      approve
                    </Button>
                    </Tooltip>
                    <Tooltip
                      title='REJECT'
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                    >
                    <Button
                      color="error"
                      variant="contained"
                      disabled={user?.approvalRequired===false}
                      size="small"
                      onClick={() => handleReject(user?.enrolmentId)}
                    >
                      reject
                    </Button>
                    </Tooltip>
                  </Stack>
                  </TableCell> */}
                  {/* <TableCell align='center'>
                    <Tooltip
                      title='Deactive-Active'
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                    >
                      <Switch
                        checked={user.passwordEnabled}
                        onChange={() =>
                          handleChange(index, user.passwordEnabled)
                        }
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </Tooltip>
                  </TableCell> */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 2}>
                  <Typography p={5} textAlign='center'>
                    NO Data Available
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 15, 20]}
        component='div'
        sx={{
          '.MuiInputBase-root': {
            // backgroundColor: 'green',
            marginTop:'-12px',
            marginRight:'5px'
          },
          '.MuiTablePagination-toolbar': {
            // backgroundColor: 'pink',
            // width: '950px',
            color: 'rgb(41, 39, 39)',
            height: '35px',
          },
          '.MuiBox-root': {
            // backgroundColor: 'yellow',
            color: 'black',
    
            '& .MuiSvgIcon-root': {
              // backgroundColor: 'purple',
              color: 'black',
            },
          },
          '.MuiTablePagination-actions':{
            marginTop:'-12px',
            marginLeft:'2px'
          },
          marginTop:'10px',
          marginBottom:'-20px'
        }}
        count={totalSize}
        rowsPerPage={pageSize}
        page={pageNumber}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    </Box>
    </>
  );
};

export default Enrollments;
