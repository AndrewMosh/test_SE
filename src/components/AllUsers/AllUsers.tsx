import { useState } from "react";
import { useSelector } from "react-redux";
import Pagination from "../Pagination/Pagination";
import UsersDetails from "../usersDetails/UsersDetails";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableContainer, useDisclosure } from "@chakra-ui/react";
import { setSelectedUser, fetchUsers, fetchSortedUsers } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import s from "./all-users.module.css";
import Loader from "../Loader/Loader";
import { RootState } from "../../store/store";
import { AppDispatch } from "../../store/store";
import { User } from "../../types/User";
import { PageProps } from "../../types/PageProps";
import { UseDisclosureReturn } from "../../types/ChakraProps";

const AllUsers: React.FC<PageProps> = ({ searchQuery, currentPage, setCurrentPage }) => {
    const { users, status } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();

    const [sorted, setSorted] = useState("asc");
    const totalPages = Math.ceil(users.length / 10);

    const handleUserClick = (user: User) => {
        dispatch(setSelectedUser(user));
    };
    const { isOpen, onOpen, onClose } = useDisclosure() as UseDisclosureReturn;
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };
    const handleSort = () => {
        setSorted(sorted === "asc" ? "desc" : "asc");
        if (sorted === "asc") {
            dispatch(fetchSortedUsers({ query: searchQuery, sortOrder: "asc" }));
            setCurrentPage(1);
        } else {
            dispatch(fetchSortedUsers({ query: searchQuery, sortOrder: "desc" }));
            setCurrentPage(1);
        }
    };
    return (
        <div className={s.all}>
            <TableContainer>
                <Table style={{ display: status === "loading" ? "block" : "" }} variant="simple">
                    <Thead>
                        <Tr>
                            <Th className={s.mobile}></Th>
                            <Th>Имя</Th>
                            <Th className={s.table} isNumeric onClick={() => handleSort()}>
                                Кол-во репозиториев
                            </Th>
                        </Tr>
                    </Thead>

                    {status === "loading" ? (
                        <Loader />
                    ) : (
                        users.slice((currentPage - 1) * 10, currentPage * 10).map((user: User) => (
                            <Tbody
                                key={user.id}
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    handleUserClick(user);
                                    onOpen();
                                }}
                            >
                                <Tr>
                                    <Td className={s.mobile}>
                                        <img style={{ borderRadius: "50%", maxWidth: "80px" }} src={user.avatar_url} alt="avatar" />
                                    </Td>
                                    <Td>{user.login}</Td>
                                    <Td className={s.table} isNumeric>
                                        {user.repos_url.length}
                                    </Td>
                                </Tr>
                            </Tbody>
                        ))
                    )}
                    {users.length !== 0 && (
                        <Tfoot>
                            <Tr>
                                <Th className={s.mobile}></Th>
                                <Th>Всего найдено:</Th>
                                <Th isNumeric>{users.length}</Th>
                            </Tr>
                        </Tfoot>
                    )}
                </Table>
            </TableContainer>

            {isOpen && <UsersDetails isOpen={isOpen} onClose={onClose} onOpen={onOpen} />}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    );
};

export default AllUsers;
