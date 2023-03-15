/* eslint-disable */
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  Switch
} from "@chakra-ui/react";
import axios from "axios";
// Custom components
import Card from "components/card/Card";
import { AndroidLogo, AppleLogo, WindowsLogo } from "components/icons/Icons";
import Menu from "components/menu/MainMenu";
import { backendHost } from "config";
import React, { useEffect, useMemo } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

export default function DevelopmentTable(props) {
  const { columnsData, tableData, fetchTableData } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const deleteUser = (userId) => {
    axios
      .delete(backendHost + `/api/users/${userId}/delete`)
      .then((res) => {
        fetchTableData()
      })
      .catch((err) => {
        console.log(err.message);
      });
    onClose()
  }
  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 11;
  useEffect(() => {
    fetchTableData()
  }, [])
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const iconColor = useColorModeValue("secondaryGray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const switchUserAdmin = (username, curr_is_staff) => {
    console.log('onChange!')
    axios.put(backendHost + '/api/users/set_user_is_staff/', {
      username,
      is_staff: !curr_is_staff
    }).then((res) => {
      fetchTableData()
    })

  }
  return (
    <Card
      direction='column'
      w='100%'
      px='0px'
      overflowX={{ sm: "scroll", lg: "hidden" }}>
      <Table {...getTableProps()} variant='simple' color='gray.500' mb='24px'>
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe='10px'
                  key={index}
                  borderColor={borderColor}>
                  <Flex
                    justify='space-between'
                    align='center'
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color='gray.400'>
                    {column.render("Header")}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index}>
                {row.cells.map((cell, index) => {
                  let data = "";
                  if (cell.column.Header === "用户名") {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
                      </Text>
                    );
                  } else if (cell.column.Header === "注册日期") {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
                      </Text>
                    );
                  } else if (cell.column.Header === "发帖量") {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
                      </Text>
                    );
                  } else if (cell.column.Header === "点赞量") {
                    data = (
                      <Text color={textColor} fontSize='sm' fontWeight='700'>
                        {cell.value}
                      </Text>
                    );
                  } else if (cell.column.Header === "操作") {
                    data = (
                      <>
                        <IconButton icon={<DeleteIcon />} onClick={onOpen} />
                        <Modal isOpen={isOpen} onClose={onClose}>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>警告</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              你确定要删除该用户吗？该操作不可逆！
                            </ModalBody>

                            <ModalFooter>
                              <Button variant='ghost' onClick={() => deleteUser(cell.row.original.id)}>确定</Button>
                              <Button colorScheme='blue' mr={3} onClick={onClose}>
                                取消
                              </Button>

                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                      </>

                    )
                    
                  } else if (cell.column.Header === "ID") {
                    data = (<Text color={textColor} fontSize='sm' fontWeight='700'>
                      {cell.value}
                    </Text>)
                  } else if (cell.column.Header === "管理员") {
                    data = (
                      <Switch colorScheme='green' onChange={() => switchUserAdmin(cell.row.original.username, cell.value)} isChecked={cell.value}/>
                    )
                  }
                  return (
                    <Td
                      {...cell.getCellProps()}
                      key={index}
                      fontSize={{ sm: "14px" }}
                      minW={{ sm: "150px", md: "200px", lg: "auto" }}
                      borderColor='transparent'>
                      {data}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Card>
  );
}
