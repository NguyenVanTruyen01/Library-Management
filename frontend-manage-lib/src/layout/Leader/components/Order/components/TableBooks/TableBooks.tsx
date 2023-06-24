import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './styles/overview.module.scss'
import MaterialReactTable, {
  MaterialReactTableProps,
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Row,
} from 'material-react-table'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
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
import { data, states } from './makeData'
import BookService from 'api/book.api'
import CategoryService from 'api/category.api'
import TotalService from 'api/total.api';
export type Book = {
  _id: string
  stt: number
  title: string
  price: Number
  quantity: Number
  author: string
  publisher: string
  bookCover: Number
  borrowCount: Number
  description: string
  discount: Number
  state: string
  category: string
};

const TableBooks = (props: any) => {

  const { listBook, deleteBook } = props;

  // const [total, setTotals] = useState<any>()
  const [tableData, setTableData] = useState<Book[]>(() => data)
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string
  }>({});

  const handleDeleteRow = useCallback(
    async (row: MRT_Row<Book>) => {
      if (
        !window.confirm(`Are you sure you want to delete ${row.getValue('title')}`)
      ) {
        return;
      }
      await deleteBook(row.original._id);
      //send api delete request here, then refetch or update local table data for re-render
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData],
  );

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<Book>,
    ): MRT_ColumnDef<Book>['muiTableBodyCellEditTextFieldProps'] => {
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

  const columns = useMemo<MRT_ColumnDef<Book>[]>(
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
        accessorKey: 'title',
        header: 'Tên sách',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },

      {
        accessorKey: 'author',
        header: 'Tác giả',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'publisher',
        header: 'Nhà xuất bản',
        muiTableBodyCellEditTextFieldProps: {
          select: true, //change to select for a dropdown
          children: states.map((state: any) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          )),
        },
      },
      {
        accessorKey: 'price',
        header: 'Giá sách',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'price',
        }),
      },

      {
        accessorKey: 'quantity',
        header: 'Tồn kho',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'number',
        }),
      },
      {
        accessorKey: '_id',
        header: 'ID',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      }
    ],
    [getCommonEditTextFieldProps],
  );


  return (
    <>
      <div className={styles.main}>
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
          data={listBook}
          editingMode="modal" //default
          enableColumnOrdering
          enableEditing
          // onEditingRowSave={handleSaveRowEdits}
          // onEditingRowCancel={handleCancelRowEdits}
          initialState={{ columnVisibility: { ID: true } }}
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem', justifyContent: "center" }}>
              <Tooltip arrow placement="right" title="Delete">
                <IconButton color="error" onClick={() => {
                  handleDeleteRow(row)
                }}>
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          renderTopToolbarCustomActions={() => (
            <div className={styles.titleTable}>SÁCH MUỐN MƯỢN</div>
          )}
        />
      </div>
    </>
  );
};

interface CreateModalProps {
  columns: MRT_ColumnDef<Book>[];
  onClose: () => void;
  onSubmit: (values: Book) => void;
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
      <DialogTitle textAlign="center">Thêm sách</DialogTitle>
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

const validateRequired = (value: string) => !!value.length
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
const validateAge = (age: number) => age >= 18 && age <= 50;

export default TableBooks;
