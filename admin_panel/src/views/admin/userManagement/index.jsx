/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import { Box, SimpleGrid } from "@chakra-ui/react";
import DevelopmentTable from "views/admin/userManagement/components/DevelopmentTable";
import CheckTable from "views/admin/dataTables/components/CheckTable";
import ColumnsTable from "views/admin/dataTables/components/ColumnsTable";
import ComplexTable from "views/admin/dataTables/components/ComplexTable";
import {
  columnsDataDevelopment,
  columnsDataCheck,
  columnsDataColumns,
  columnsDataComplex,
} from "views/admin/userManagement/variables/columnsData";
import tableDataDevelopment from "views/admin/userManagement/variables/tableDataDevelopment.json";
import tableDataCheck from "views/admin/dataTables/variables/tableDataCheck.json";
import tableDataColumns from "views/admin/dataTables/variables/tableDataColumns.json";
import tableDataComplex from "views/admin/dataTables/variables/tableDataComplex.json";
import React, { useState } from "react";
import { backendHost } from "config";
import axios from "axios";
import moment from "moment";

export default function Settings() {
  // Chakra Color Mode
  const [tableData, setTableData] = useState([])
  const fetchTableData = () => {
    let url = backendHost +
      `/api/users/user_data/`;
    axios
      .get(url)
      .then((res) => {
        setTableData(res.data.users.map((u) => {
          console.log(u)
          return {
            id: u.id,
            username: u.name,
            date: moment(u.joined_date).format(
              "YYYY 年 MM 月 D 日 "
            ),
            thumbs: u.num_thumbs,
            blogs: u.num_blogs,
            is_staff: u.is_staff
          }
        }));
      })
      .catch((err) => setTableData(null));
  }
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        mb='20px'
        columns={1}
        spacing={{ base: "20px", xl: "20px" }}>
        <DevelopmentTable
          columnsData={columnsDataDevelopment}
          tableData={tableData}
          fetchTableData={fetchTableData}
        />
      </SimpleGrid>
    </Box>
  );
}
