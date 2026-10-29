import { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import UserListFilters from "../../sections/userManagement/UserLists/UserListFilters";
import UserListCard2 from "../../sections/userManagement/UserLists/UserListCard2";
import useLocalStorage from "../../hooks/useLocalStorage";
import useResponse from "../../helper";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../utils/constants";
import { toast } from "react-toastify";
import EnrolmentFilters from "./EnrolmentFilters";
import Enrollments from "./Enrollments";
const Users = () => {
  // const [{ accessToken, reportingRoleName, branchDistrict,roleName }] =
  //   useLocalStorage("jwtWithDetails");
  const { BranchApi } = useResponse();
  const [selectedFilter, setSelectedFilter] = useState("mobileNumber");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [branches, setBranches] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [roleFilter, setRoleFilter] = useState("role");
  const [roleFilter2, setRoleFilter2] = useState("role");
  const [roleSearch, setRoleSearch] = useState("");

  const navigate = useNavigate();
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}>
          <EnrolmentFilters
            branches={branches}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            search={search}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            setRoleFilter2={setRoleFilter2}
            setRoleSearch={setRoleSearch}
            districts={districts}
            setSearch={setSearch}
            setFromDate={setFromDate}
            setToDate={setToDate}
          />
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          <Enrollments
            search={search}
            setSearch={setSearch}
            roleFilter={roleFilter2}
            roleSearch={roleSearch}
            selectedFilter={selectedFilter}
            branches={branches}
            fromDate={fromDate}
            toDate={toDate}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Users;
