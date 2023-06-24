import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './styles/category.module.scss'
import MaterialReactTable, {
  MaterialReactTableProps,
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Row,
} from 'material-react-table'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material'
import { data, states } from './makeData'
import CategoryService from 'api/category.api'
import Header from "./components/Header/Header"
import TotalService from 'api/total.api';


export type Category = {
  _id: string
  stt: number
  name: string
  description: number
  quantityBooks: number
  books: [object]
};

const Category = () => {


  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [total, setTotals] = useState<any>()
  const [tableData, setTableData] = useState<Category[]>(() => data)
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string
  }>({});

  const handleCreateNewRow = (values: Category) => {
    tableData.push(values)
    setTableData([...tableData])
  };

  const handleSaveRowEdits: MaterialReactTableProps<Category>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(validationErrors).length) {
        tableData[row.index] = values
        console.log("Data sau khi edit: ", tableData[row.index])

        let id = tableData[row.index]._id

        let data = {
          name: tableData[row.index].name,
          description: tableData[row.index].description
        }

        await CategoryService.onUpdateCategoryById({ data, id })
          .then((result: any) => {
            toast.success("Cập nhật thể loại sách thành công", { autoClose: 1000 });

            // delete data["_id"];
            //send/receive api updates here, then refetch or update local table data for re-render
            setTableData([...tableData]);
            exitEditingMode(); //required to exit editing mode and close modal
          })
          .catch((error: any) => {
            toast.error(error.response.data.msg, { autoClose: 1000 })
          })

      }
    };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    async (row: MRT_Row<Category>) => {
      if (
        !window.confirm(`Sau khi xóa thể loại sách: ${row.getValue('name')}. Các sách có trong thể loại này sẽ bị xóa. Bạn có chắc chắn muốn xóa !`)
      ) {
        return;
      }
      console.log("Row", row)
      await CategoryService.onDeleteCategoryById(row.original._id)

      //send api delete request here, then refetch or update local table data for re-render
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData],
  );

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<Category>,
    ): MRT_ColumnDef<Category>['muiTableBodyCellEditTextFieldProps'] => {
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

  const columns = useMemo<MRT_ColumnDef<Category>[]>(
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
        accessorKey: 'name',
        header: 'Tên thể loại',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },

      {
        accessorKey: 'description',
        header: 'Mô tả',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },

      {
        accessorKey: 'quantityBooks',
        header: 'Số sách có trong thể loại',
        size: 230,
        enableEditing: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: '_id',
        header: 'ID',
        size: 80,
        enableEditing: false,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      }
    ],
    [getCommonEditTextFieldProps],
  );

  const columnsCreate = useMemo<MRT_ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Tên thể loại sách',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },

      {
        accessorKey: 'description',
        header: 'Mô tả',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },

    ],
    [getCommonEditTextFieldProps],
  );

  let dbCategories = useCallback(async () => {
    return await CategoryService.getAllCategory()
  }, [])

  let fetchTotal = useCallback(async () => {
    return await TotalService.getAllTotal()
  }, [])



  useEffect(() => {
    dbCategories().then((result: any) => {
      let arr = []
      for (let index = 0; index < result?.data.length; index++) {
        let ele: Category = { ...result?.data[index] }
        ele.stt = index + 1
        ele.quantityBooks = result?.data[index].books.length;
        arr.push(ele)
      }
      setTableData(arr)
    })
    fetchTotal().then((result: any) => {
      setTotals(result?.data);
      console.log(result);
    })
  }, [createModalOpen])

  return (
    <>
      <div className={styles.main}>

        <Header />

        <div className={styles.groupBtn}>
          <button className={styles.btnAdd}
            onClick={() => setCreateModalOpen(true)}
          >Thêm thể loại sách</button>
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
          onEditingRowSave={handleSaveRowEdits}
          onEditingRowCancel={handleCancelRowEdits}
          initialState={{ columnVisibility: { ID: true } }}
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>

              <Tooltip arrow placement="left" title="Chỉnh sửa danh mục sách">
                <IconButton onClick={() => table.setEditingRow(row)}>
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

        <CreateNewAccountModal
          columnsCreate={columnsCreate}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateNewRow}
        />

      </div>
    </>
  );
};





// ==================================================================================
interface CreateModalProps {
  columnsCreate: MRT_ColumnDef<Category>[];
  onClose: () => void;
  onSubmit: (values: Category) => void;
  open: boolean;
}

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({
  open,
  columnsCreate,
  onClose,
  onSubmit,
}: CreateModalProps) => {


  let [values, setValues] = useState<any>(() =>
    columnsCreate.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {} as any),
  );

  // Xử lý tạo sách mới
  const handleSubmit = async () => {
    try {

      await CategoryService.onCreateCategory(values);
      toast.success("Đã tạo mới thể loại sách!!!", { autoClose: 1000 });

      // onClose();
    } catch (err: any) {
      console.log("New category is:", err)
      toast.error(err.response.data.msg, { autoClose: 1000 });
    }


  };

  return (

    <Dialog
      open={open}
      fullWidth={true}
      maxWidth={"sm"}
    >
      <DialogTitle textAlign="center">Thêm thể loại sách</DialogTitle>
      <DialogContent>

        <form className={styles.formCreateBook} onSubmit={(e) => e.preventDefault()}>

          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {columnsCreate.map((column) => (

              <TextField
                required
                key={column.accessorKey}
                label={column.header}
                InputProps={{ inputProps: { min: 0 } }}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            ))}

          </Stack>
        </form>

      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button color="warning" size="medium" variant="contained" onClick={onClose}>Hủy</Button>
        <Button color="primary" size="medium" onClick={handleSubmit} variant="contained">
          Thêm sách
        </Button>
      </DialogActions>
    </Dialog >
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

export default Category;
