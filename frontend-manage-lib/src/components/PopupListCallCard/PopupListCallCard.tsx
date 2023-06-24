
import React from 'react'
import styles from './styles/popupListCallCard.module.scss'
import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import OderService from 'api/order.api'
import { toast } from 'react-toastify';
import { convertDate } from 'utility/ConvertDate'
import PopupEditCallCard from 'layout/Leader/components/Order/components/PopupEditOder/PopupEditOder';

import MaterialReactTable, {
    MaterialReactTableProps,
    MRT_Cell,
    MRT_ColumnDef,
    MRT_Row,
} from 'material-react-table';

import {
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';

import { Delete, Edit } from '@mui/icons-material'

export type CallCard = {
    _id: string
    stt: number
    createdAt: string
    dueDate: string
    fee: number
    borrower: string
    issueDate: string
    active: string
    quantity: number
    books: any,
    waitingOrder: boolean
};

const PopupListCallCard = (props: any) => {

    const { idUser } = props;

    const [popupEditOrder, setPopupEditOrder] = useState<Boolean>(false)
    const [detailOder, setDetailOder] = useState<any>({})
    const [tableData, setTableData] = useState<CallCard[]>([])
    const [validationErrors, setValidationErrors] = useState<{
        [cellId: string]: string
    }>({});

    const handleSaveRowEdits: MaterialReactTableProps<CallCard>['onEditingRowSave'] =
        async ({ exitEditingMode, row, values }) => {
            if (!Object.keys(validationErrors).length) {
                tableData[row.index] = values;
                console.log("Data sau khi edit: ", tableData[row.index])

                let id = tableData[row.index]._id;
                let data = {
                    dueDate: tableData[row.index].dueDate,
                    createdAt: tableData[row.index].createdAt,
                    fee: tableData[row.index].fee,
                    issueDate: tableData[row.index].issueDate,
                    active: tableData[row.index].active,
                    borrower: tableData[row.index].borrower,
                }
                await OderService.onUpdateOderByID({ data, id }).then((result: any) => {
                    console.log("res:" + result)
                });

                setTableData([...tableData]);
                exitEditingMode(); //required to exit editing mode and close modal
            }
        };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };

    const handleDeleteRow = useCallback(
        async (row: MRT_Row<CallCard>) => {
            if (
                !window.confirm(`Bạn chắc chắn muốn xóa phiếu mượn của: ${row.getValue('borrower')}`)
            ) {
                return;
            }

            const deleteCallCard = async () => {
                await OderService.onDeleteOderByID(row.original._id);
            }

            await toast.promise(
                deleteCallCard(),
                {
                    pending: 'Đang xóa phiếu mượn',
                    success: 'Đã xóa phiếu mượn thành công 👌',
                    error: `Không thể xóa phiếu mượn, phiếu có thể chưa trả,
            Vui lòng khiểm tra lại !`
                },
                {
                    autoClose: 3000
                }
            );


            tableData.splice(row.index, 1);
            setTableData([...tableData]);
        },
        [tableData],
    );

    const getCommonEditTextFieldProps = useCallback(
        (
            cell: MRT_Cell<CallCard>,
        ): MRT_ColumnDef<CallCard>['muiTableBodyCellEditTextFieldProps'] => {
            console.log(cell)
            return {
                error: !!validationErrors[cell.id],
                helperText: validationErrors[cell.id],
                onBlur: (event) => {
                    const isValid =
                        cell.column.id === 'email'
                            ? validateEmail(event.target.value)
                            : cell.column.id === 'age'
                                ? validateAge(+event.target.value)
                                : validateRequired(event.target.value);
                    if (!isValid) {
                        //set validation error for cell if invalid
                        setValidationErrors({
                            ...validationErrors,
                            [cell.id]: `${cell.column.columnDef.header} is required`,
                        });
                    } else {
                        //remove validation error for cell if valid
                        delete validationErrors[cell.id];
                        setValidationErrors({
                            ...validationErrors,
                        });
                    }
                },
            };
        },
        [validationErrors],
    );

    const columns = useMemo<MRT_ColumnDef<CallCard>[]>(
        () => [
            {
                accessorKey: 'stt',
                header: 'STT',
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: false,
                size: 80,
            },

            {
                accessorKey: 'active',
                header: 'Tình trạng',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                    // type: "string"
                }),
            },

            {
                accessorKey: 'borrower',
                header: 'Người mượn',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'createdAt',
                header: 'Ngày Mượn',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },

            {
                accessorKey: 'dueDate',
                header: 'Ngày Trả',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'fee',
                header: 'Tổng hóa đơn',
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                    type: 'Number',
                }),
            },
            {
                accessorKey: 'quantity',
                header: 'Số lượng sách mượn',
                size: 80,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),

                }),
            },

        ],
        [getCommonEditTextFieldProps],
    );

    let db = useCallback(async () => {
        return await OderService.getOderByUserID(idUser);
    }, [])


    const getStatusCallCards = (active: boolean, waitingOrder: boolean): string => {

        if (!waitingOrder) {
            return "Đang chờ xét duyệt"
        }
        else {
            if (active) {
                return "Chưa trả"
            }
            else {
                return "Đã trả"
            }
        }
    }

    useEffect(() => {
        db().then((result: any) => {

            console.log("result", result)
            let arr = [];


            for (let index = 0; index < result?.data.length; index++) {
                let ele: CallCard = {
                    _id: result?.data[index]._id,
                    stt: index + 1,
                    createdAt: convertDate(result?.data[index].createdAt),
                    dueDate: convertDate(result?.data[index]?.dueDate),
                    fee: result?.data[index]?.fee,
                    issueDate: convertDate(result?.data[index].issueDate),

                    active: getStatusCallCards(result?.data[index]?.active, result?.data[index]?.waitingOrder),

                    borrower: result?.data[index]?.borrower?.name ? result?.data[index]?.borrower?.name : "Tài khoản đã bị xóa",
                    quantity: result?.data[index]?.books.length,
                    books: result?.data[index]?.books,
                    waitingOrder: result?.data[index]?.waitingOrder
                }
                arr.push(ele)
            }
            setTableData(arr)
            console.log("tableData", tableData)
        })

    }, [popupEditOrder])


    return (
        <div className={styles.contentsPopup}>
            <MaterialReactTable
                displayColumnDefOptions={{
                    'mrt-row-actions': {
                        muiTableHeadCellProps: {
                            align: 'center',
                        },
                        size: 120,
                    },
                }}
                columns={columns}
                data={tableData}
                // editingMode="modal" //default
                enableColumnOrdering
                enableEditing
                onEditingRowSave={handleSaveRowEdits}
                onEditingRowCancel={handleCancelRowEdits}
                renderRowActions={({ row, table }) => (
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        <Tooltip arrow placement="left" title="Edit">
                            <IconButton onClick={() => {
                                setPopupEditOrder(true)
                                setDetailOder(row.original._id)
                            }}>
                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="right" title="Delete">
                            <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            />

            {
                popupEditOrder ? <PopupEditCallCard detailCallCard={detailOder} handleClose={() => setPopupEditOrder(false)} /> : <></>
            }

        </div >
    )
}


const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
    !!email.length &&
    email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
const validateAge = (age: number) => age >= 18 && age <= 50

export default PopupListCallCard