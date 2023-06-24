import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './styles/category.module.scss'
import MaterialReactTable, {
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Row,
} from 'material-react-table'
import 'react-toastify/dist/ReactToastify.css';


import {
  Box,

  IconButton,

  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material'
import { data } from './makeData'

import AuthServices from 'api/auth.api'
import Header from "./components/Header/Header"
import TotalService from 'api/total.api';

import SideBarRegister from "./components/SideBarRegister/SideBarRegister"
import PopupEditAccount from './components/PopupEditAccount/PopupEditAccount';
import { toast } from 'react-toastify';


export type Auth = {
  _id: string
  stt: number
  name: string
  email: string
  role: string
  phone: string
  mssv: string
  cmnd: string
  age: number
  addressCurrent: string
  addressHouse: string
  avatar: object
};

const Account = () => {

  const [popupEditAccount, setPopupEditAccount] = useState<Boolean>(false)
  const [detailAccount, setDetailAccount] = useState<any>({})

  let [page, setPage] = useState<number>(1)
  let [openSidebarUpdate, setOpenSidebarUpdate] = useState<Boolean>(false)

  const [total, setTotals] = useState<any>()
  const [tableData, setTableData] = useState<Auth[]>(() => data)
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string
  }>({});



  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    async (row: MRT_Row<Auth>) => {
      if (
        !window.confirm(`Bạn có chắc chắn muốn xóa tài khoản được đăng ký với emal:  ${row.getValue('email')} !`)
      ) {
        return;
      }

      const deleteAccount = async (id: string) => {
        await AuthServices.deleteAccountById(id);
      }

      await toast.promise(
        deleteAccount(row.original._id),
        {
          pending: `Đang xóa tài khoản ${row.getValue('email')}}`,
          success: 'Xóa tài khoản thành công 👌',
          error: 'Xóa tài khoản thất bại🤯'
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
      cell: MRT_Cell<Auth>,
    ): MRT_ColumnDef<Auth>['muiTableBodyCellEditTextFieldProps'] => {
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

  const columns = useMemo<MRT_ColumnDef<Auth>[]>(
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
        accessorKey: 'mssv',
        header: 'MSSV',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'name',
        header: 'Tên thể loại',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },

      {
        accessorKey: 'phone',
        header: 'Số điện thoại',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },

      {
        accessorKey: 'cmnd',
        header: 'CCCD',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },

      {
        accessorKey: 'role',
        header: 'Loại tài khoản',
        size: 230,
        enableEditing: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
    ],
    [getCommonEditTextFieldProps],
  );


  let dbAuth = useCallback(async () => {
    return await AuthServices.getAllAccount(page)
  }, [])

  let fetchTotal = useCallback(async () => {
    return await TotalService.getAllTotal()
  }, [])


  useEffect(() => {

    dbAuth().then((result: any) => {

      console.log("result", result)

      let arr = []
      for (let index = 0; index < result?.data.data.length; index++) {
        let ele: Auth = { ...result?.data.data[index] }
        ele.stt = index + 1;
        arr.push(ele)
      }
      setTableData(arr)
    })

    fetchTotal().then((result: any) => {
      setTotals(result?.data);
      console.log(result);
    })
  }, [popupEditAccount, openSidebarUpdate])

  return (
    <>
      <div className={styles.main}>

        <Header />

        <div className={styles.groupBtn}>
          <button className={styles.btnAdd}
            onClick={() => setOpenSidebarUpdate(true)}
          >Thêm tài khoản</button>
        </div>

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
          editingMode="modal" //default
          enableColumnOrdering
          enableEditing
          // onEditingRowSave={handleSaveRowEdits}
          onEditingRowCancel={handleCancelRowEdits}
          initialState={{ columnVisibility: { ID: true } }}
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>

              <Tooltip arrow placement="left" title="Chỉnh sửa danh mục sách">
                <IconButton onClick={() => {
                  //Lấy thông tin sách ở hàng
                  setDetailAccount(row.original)
                  setPopupEditAccount(true)
                }
                }>
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
          renderTopToolbarCustomActions={() => (
            <div className={styles.groupActionTable}>
              <div className={styles.titleTable}>  DANH SÁCH THỂ LOẠI SÁCH</div>
            </div>
          )}
        />


        {
          openSidebarUpdate ? <SideBarRegister handleClose={() => setOpenSidebarUpdate(false)} /> : <></>
        }

        {
          popupEditAccount ? <PopupEditAccount detailAccount={detailAccount} handleClose={() => setPopupEditAccount(false)} /> : <></>
        }


      </div>
    </>
  );
};


const validateRequired = (value: string) => !!value.length
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
const validateAge = (age: number) => age >= 18 && age <= 50;

export default Account;
