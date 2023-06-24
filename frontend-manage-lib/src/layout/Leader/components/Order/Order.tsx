import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './styles/order.module.scss'
import OderService from 'api/order.api'
import Header from './components/Header/Header'
import MaterialReactTable, {
  MaterialReactTableProps,
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Row,
} from 'material-react-table';
import {
  Box, Button, Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material'
import { data } from './makeData'
import BookService from 'api/book.api'
import CategoryService from 'api/category.api'
import TotalService from 'api/total.api'
import { convertDate } from 'utility/ConvertDate'
import PopupScan from './components/PopupScan/PopupScan'
import AddOder from './components/AddOder/AddOder';
import PopupEditOder from './components/PopupEditOder/PopupEditOder';

import axios, { AxiosError } from "axios"

export type Person = {
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
interface Totals {
  countAuths: number,
  countCategories: number
  countBooks: number
  countCallCards: {
    true: number,
    false: number
  }
}

interface Error {
  code: string,
  message: string
  response: {
    data: any,
    status: number,
  }
}


let statistical: Totals = {
  countAuths: 0,
  countCategories: 0,
  countBooks: 0,
  countCallCards: {
    true: 0,
    false: 0
  },
}

const Oder = () => {
  const [popupEditOrder, setPopupEditOrder] = useState<Boolean>(false)
  const [detailOder, setDetailOder] = useState<any>({})
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [tableData, setTableData] = useState<Person[]>(() => data)
  const [popupPayBook, setPopupPayBook] = useState<Boolean>(false)
  const [popupAddOder, setPopupAddOder] = useState<Boolean>(false)
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string
  }>({});

  const qrRef = useRef<any>(null);

  const handleCreateNewRow = (values: Person) => {
    tableData.push(values);
    setTableData([...tableData]);

    console.log(tableData)
  };

  const handleSaveRowEdits: MaterialReactTableProps<Person>['onEditingRowSave'] =
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
        // delete data["_id"];
        //send/receive api updates here, then refetch or update local table data for re-render
        setTableData([...tableData]);
        exitEditingMode(); //required to exit editing mode and close modal
      }
    };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    async (row: MRT_Row<Person>) => {
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
      cell: MRT_Cell<Person>,
    ): MRT_ColumnDef<Person>['muiTableBodyCellEditTextFieldProps'] => {
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

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
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
    return await OderService.getAllOder()
  }, [])

  const getStatistical = async () => {

    await TotalService.getAllTotal().then((res: any) => {
      const total = res.data;
      console.log(total)
      statistical = {
        countAuths: total.countAuths ? total.countAuths : 0,
        countCategories: total.countCategories ? total.countCategories : 0,
        countBooks: total.countBooks ? total.countBooks : 0,
        countCallCards: {
          true: total.countCallCards.true ? total.countCallCards.true : 0,
          false: total.countCallCards.false ? total.countCallCards.false : 0,
        },
      }
    })
  }

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
      console.log("result: ", result.data)
      let arr = [];


      for (let index = 0; index < result?.data.length; index++) {
        let ele: Person = {
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

    getStatistical();

  }, [popupAddOder, popupEditOrder])

  return (
    <>
      <div className={styles.main}>

        <Header statistical={statistical} />

        <div className={styles.payBook}>
          <button onClick={() => setPopupAddOder(true)} className={styles.btnAdd}>Mượn sách</button>
          <button onClick={() => setPopupPayBook(true)} className={styles.btnReturn}>Trả sách</button>
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
                  console.log("row.original", row.original)
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
          renderTopToolbarCustomActions={() => (
            <div className={styles.titleTable}> DANH SÁCH PHIẾU MƯỢN SÁCH</div>
          )}
        />

        <CreateNewAccountModal
          columns={columns}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateNewRow}
        />
      </div>

      {
        popupPayBook ? <PopupScan handleClose={() => setPopupPayBook(false)} /> : <></>
      }
      {
        popupAddOder ? <AddOder handleClose={() => setPopupAddOder(false)} /> : <></>
      }
      {
        popupEditOrder ? <PopupEditOder detailCallCard={detailOder} handleClose={() => setPopupEditOrder(false)} /> : <></>
      }
    </>
  );
};

interface CreateModalProps {
  columns: MRT_ColumnDef<Person>[];
  onClose: () => void;
  onSubmit: (values: Person) => void;
  open: boolean;
}
//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({
  open,
  columns,
  onClose,
  onSubmit,
}: CreateModalProps) => {
  const [values, setValues] = useState<any>(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {} as any),
  );
  const [categorys, setCategorys] = useState<any>([])
  const handleSubmit = async () => {
    //put your validation logic here
    onSubmit(values);
    console.log("Value is:", values)
    let db = await BookService.onCreate(values)
    console.log("result", db)

    onClose();
  };
  let db = useCallback(async () => {
    return await CategoryService.getAllCategory()
  }, [])
  useEffect(() => {
    db().then((result: any) => {
      console.log("category" + result?.data[0]?.name)
      setCategorys(result?.data)
    })
  }, [])

  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Cho mượn sách</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {columns.map((column) => (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            ))}
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={"Văn học"}
              name={"category"}
              label={"Danh Mục"}
              onChange={(e) =>
                setValues({ ...values, [e.target.name]: e.target.value })
              }
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {
                categorys?.length > 0 ? categorys.map((value: any, index: number) => {
                  return <MenuItem value={value._id} key={value}>{value.name}</MenuItem>
                }) : <></>
              }
            </Select>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Thêm sách
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
const validateAge = (age: number) => age >= 18 && age <= 50

export default Oder
