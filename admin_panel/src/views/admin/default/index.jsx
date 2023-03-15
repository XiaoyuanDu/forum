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
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
// Assets
import Usa from "assets/img/dashboards/usa.png";
// Custom components
import MiniCalendar from "components/calendar/MiniCalendar";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useEffect, useState } from "react";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from "react-icons/md";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieCard from "views/admin/default/components/PieCard";
import Tasks from "views/admin/default/components/Tasks";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import {
  columnsDataBlog,
  columnsDataAuthor,
} from "views/admin/default/variables/columnsData";
import tableDataBlog from "views/admin/default/variables/tableDataBlog.json";
import tableDataAuthor from "views/admin/default/variables/tableDataAuthor.json";
import axios from "axios";
import { backendHost } from "config";
import moment from "moment";

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const [blogsIn7Days, setBlogsIn7SevenDays] = useState(0);
  const [usersIn7Days, setUsersIn7SevenDays] = useState(0);
  const [commentsIn7Days, setCommentsIn7SevenDays] = useState(0);
  const [top10BlogsColumnsData, setTop10BlogsColumnsData] = useState([])
  const [top10UsersColumnsData, setTop10UsersColumnsData] = useState([])
  const fetchData = () => {
    let url = backendHost + '/api/forum/statistics/get_last_seven_days_data'
    axios.get(url)
      .then((res) => {
        setBlogsIn7SevenDays(res.data.new_blogs_in_7_days);
        setCommentsIn7SevenDays(res.data.new_comments_in_7_days);
        setUsersIn7SevenDays(res.data.new_users_in_7_days);
      })
    url = backendHost + '/api/forum/statistics/get_top_10_thumbs_blogs'
    axios.get(url)
      .then((res) => {
        setTop10BlogsColumnsData(res.data.map(b => {
          return {
            title: b.title,
            author: b.user.username,
            thumbs: b.likes,
            date: moment(b.date_created).format(
              "YYYY 年 MM 月 D 日 "
            )
          }
        }
        ))
      })
    url = backendHost + '/api/forum/statistics/get_top_10_thumbs_users'
      axios.get(url)
        .then((res) => {
          setTop10UsersColumnsData(res.data.users.map(u => {
            return {
              author: u.name,
              thumbs: u.num_thumbs,
              blogs: u.num_blogs
            }
          }
          ))
        })
  }


useEffect(() => {
  fetchData()
}, [])
return (
  <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
    <SimpleGrid
      columns={{ base: 1, md: 2, lg: 3, "2xl": 3 }}
      gap='20px'
      mb='20px'>
      <MiniStatistics
        startContent={
          <IconBox
            w='56px'
            h='56px'
            bg={boxBg}
            icon={
              <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
            }
          />
        }
        name='过去七天发帖量'
        value={blogsIn7Days}
      />
      <MiniStatistics
        startContent={
          <IconBox
            w='56px'
            h='56px'
            bg={boxBg}
            icon={
              <Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />
            }
          />
        }
        name='过去七天评论人数'
        value={commentsIn7Days}
      />
      <MiniStatistics name='过去七天新增用户数量' value={usersIn7Days} />
      {/*         
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
              icon={<Icon w='28px' h='28px' as={MdAddTask} color='white' />}
            />
          }
          name='New Tasks'
          value='154'
        /> */}
      {/* <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name='Total Projects'
          value='2935'
        /> */}
    </SimpleGrid>

    {/* <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
        <TotalSpent />
        <WeeklyRevenue />
      </SimpleGrid> */}
    <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
      <CheckTable title="博客点赞量Top10" columnsData={columnsDataBlog} tableData={top10BlogsColumnsData} />
      <CheckTable title="用户点赞量Top10" columnsData={columnsDataAuthor} tableData={top10UsersColumnsData} />
    </SimpleGrid>
    {/* <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap='20px' mb='20px'>
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px'>
          <Tasks />
          <MiniCalendar h='100%' minW='100%' selectRange={false} />
        </SimpleGrid>
      </SimpleGrid> */}
  </Box>
);
}
