import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import styles from './styles/overview.module.scss'
import MaterialReactTable, {
  MaterialReactTableProps,
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Row,
} from 'material-react-table'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';

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
import BookService from 'api/book.api'
import CategoryService from 'api/category.api'
import Header from "./components/Header/Header"
import TotalService from 'api/total.api';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { imageUpload } from '../../../../utility/ImagesUpload'
import PopupEditBook from './components/PopupEditBook/PopupEditBook';


export type Person = {
  _id: string
  stt: number
  title: string
  price: Number
  quantity: Number
  author: string
  publisher: string
  bookCover: object
  borrowCount: Number
  description: string
  discount: Number
  state: string
  category: string
  QRCode: string
};

const Example = () => {

  const [popupEditBook, setPopupEditBook] = useState<Boolean>(false)
  const [detailBook, setDetailBook] = useState<any>({})


  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [total, setTotals] = useState<any>()
  const [tableData, setTableData] = useState<Person[]>(() => data)
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string
  }>({});

  const handleCreateNewRow = (values: Person) => {
    tableData.push(values)
    setTableData([...tableData])
  };

  const handleSaveRowEdits: MaterialReactTableProps<Person>['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(validationErrors).length) {
        tableData[row.index] = values
        console.log("Data sau khi edit: ", tableData[row.index])

        let id = tableData[row.index]._id

        let data = {
          author: tableData[row.index].author,
          price: tableData[row.index].price,
          title: tableData[row.index].title,
          quantity: tableData[row.index].quantity
        }
        await BookService.onUpdate({ data, id }).then((result: any) => {
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
        !window.confirm(`Bạn chắc chắn muốn xóa sách: ${row.getValue('title')}`)
      ) {
        return;
      }
      console.log("Row", row)
      await BookService.onDelete({ id: row.original._id })
      //send api delete request here, then refetch or update local table data for re-render
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
        accessorKey: 'title',
        header: 'Tên sách',
        size: 200,
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
        size: 30,
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

  const columnsCreate = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Tên sách',
        size: 200,
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
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'number',
        }),
      },
      {
        accessorKey: 'quantity',
        header: 'Số lượng sách',
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'number',
        }),
      },
    ],
    [getCommonEditTextFieldProps],
  );

  let db = useCallback(async () => {
    return await BookService.getAllBook(1)
  }, [])

  let fetchTotal = useCallback(async () => {
    return await TotalService.getAllTotal()
  }, [])

  useEffect(() => {
    db().then((result: any) => {
      let arr = []
      for (let index = 0; index < result?.data.length; index++) {
        let ele: Person = { ...result?.data[index] }
        ele.stt = index + 1
        arr.push(ele)
      }
      setTableData(arr)
    })
    fetchTotal().then((result: any) => {
      setTotals(result?.data);
      console.log(result);
    })
  }, [createModalOpen, popupEditBook])

  return (
    <>
      <div className={styles.main}>



        <Header />

        <div className={styles.groupBtn}>
          <button className={styles.btnAdd}
            onClick={() => setCreateModalOpen(true)}
          >Thêm sách</button>
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
              <Tooltip arrow placement="left" title="Edit">
                <IconButton onClick={() => {

                  //Lấy thông tin sách ở hàng
                  setDetailBook(row.original)
                  setPopupEditBook(true)
                }
                }
                >
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
              <div className={styles.titleTable}> SÁCH CÓ TRONG THƯ VIỆN</div>
            </div>
          )}
        />

        <CreateNewAccountModal
          columnsCreate={columnsCreate}
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmit={handleCreateNewRow}
        />

        {
          popupEditBook ? <PopupEditBook detailBook={detailBook} handleClose={() => setPopupEditBook(false)} /> : <></>
        }

      </div>
    </>
  );
};





// ==================================================================================
interface CreateModalProps {
  columnsCreate: MRT_ColumnDef<Person>[];
  onClose: () => void;
  onSubmit: (values: Person) => void;
  open: boolean;
}

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({
  open,
  columnsCreate,
  onClose,
  onSubmit,
}: CreateModalProps) => {

  const [description, setDescription] = React.useState('');
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<any>([])

  const [urlQRCode, setUrlQRCode] = useState<string>("");


  //Lưu avatar khi thay đổi
  const [imagesBookCover, setImagesBookCover] = useState<File[]>([]);
  const [onChangeBookCover, setOnChangeBookCover] = useState<Boolean>(false)

  const handleOnChangeBookCover = (e: any) => {
    e.preventDefault()
    const files = [...e.target.files]

    let err = "";

    if (!files[0]) return err = "File does not exist"
    if (files[0].type !== "image/jpeg" && files[0].type !== "image/png" && files[0].type !== "image/jpg")
      return err = "Image format is incorrect"

    if (err) {
      console.log("Error Img", err)
    }

    else {
      setImagesBookCover(files);
      setOnChangeBookCover(true)
    }

    e.target.value = null;

  }

  const handleGetBookCover = async () => {

    try {

      let media: any = []
      if (imagesBookCover.length > 0) {
        media = await imageUpload(imagesBookCover);
        // setOnChangeBookCover(false)
        // setImagesBookCover([])
        return media;
      }
      else return;

    } catch (error) {
      console.log(error)
    }

  }

  const handleChangeDesc = async (value: string) => {
    console.log("Description", value)
    await setDescription(value);
  };

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  let [values, setValues] = useState<any>(() =>
    columnsCreate.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {} as any),
  );

  const createNewBook = async () => {

    values.quantity = +values.quantity;
    values.price = +values.price;
    values.description = description;
    values.category = category;

    const bookCover = await handleGetBookCover();
    values.bookCover = bookCover[0];

    const res = await BookService.onCreate(values)

    if (res?.data)
      await setUrlQRCode(res?.data.QRCode)

    // console.log("New book is:", res?.data)

  }

  // Xử lý tạo sách mới
  const handleSubmit = async () => {

    await toast.promise(
      createNewBook,
      {
        pending: 'Đang tạo sách mới',
        success: 'Đã tạo sách mới thành công 👌',
        error: 'Không thể tạo sách mới 🤯'
      },
      {
        autoClose: 2000
      }
    );

  };

  const handleCloseModal = () => {
    onClose();
    setUrlQRCode("")
    setOnChangeBookCover(false)
    setImagesBookCover([])
  };

  // Lấy danh sách thể loại sách dưới database đổ lên thẻ select
  let db = useCallback(async () => {
    return await CategoryService.getAllCategory()
  }, [])


  useEffect(() => {
    db().then((result: any) => {
      console.log("category: ", result?.data)
      setCategories(result?.data)
    })
  }, [])

  return (
    <Dialog
      open={open}
      fullWidth={true}
      maxWidth={"md"}
    >
      <DialogTitle textAlign="center">Thêm sách</DialogTitle>
      <DialogContent>

        <form className={styles.formCreateBook} onSubmit={(e) => e.preventDefault()}>

          <div className={styles.groupImg}>

            {
              urlQRCode ?
                <div className={styles.generateQR}>
                  <img

                    src={urlQRCode ? urlQRCode
                      :
                      'https://upload.wikimedia.org/wikipedia/en/f/fb/Le_Livre_d%27image.png'}

                    alt='' />
                  <a href={urlQRCode} download >Tải xuống QR</a>

                </div>
                :
                <></>
            }

            <div className={styles.imgBook}>

              {
                !onChangeBookCover ?
                  <div className={styles.addImg}>
                    <i className="fas fa-camera"></i>
                    <div >
                      Thêm ảnh
                    </div>
                  </div>
                  :
                  <img
                    src={onChangeBookCover ? URL.createObjectURL(imagesBookCover[0])
                      :
                      'https://upload.wikimedia.org/wikipedia/en/f/fb/Le_Livre_d%27image.png'}

                    alt='' />
              }


              <div className={styles.editCoverBook} >
                <label>
                  <i className="fa fa-camera"></i>
                  <input type="file"
                    onChange={handleOnChangeBookCover} />
                </label>
              </div>
            </div>

          </div>


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
                type={column.accessorKey === "quantity" || column.accessorKey === "price" ? "number" : ""}
                name={column.accessorKey}
                onChange={(e) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
              />
            ))}

            <FormControl>
              <InputLabel id="demo-simple-select-autowidth-label">Thể loại sách</InputLabel>
              <Select
                required
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={category}
                onChange={handleChangeCategory}
                autoWidth
                label="Thể loại sách"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {
                  categories ?
                    categories.map((category: any, index: number) =>
                      <MenuItem key={index} value={category._id}>{category.name}</MenuItem>) : ""
                }

              </Select>
            </FormControl>

            <FormControl>
              <FormLabel className={styles.lableTextarea}>Giới thiệu sách</FormLabel>
              <Textarea className={styles.textarea}
                value={description}
                onChange={(e) => {
                  e.preventDefault();
                  handleChangeDesc(e.target.value);
                }}
                placeholder="Viết mô tả" minRows={2} />
            </FormControl>

          </Stack>
        </form>

      </DialogContent >
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button color="warning" size="medium" variant="contained" onClick={
          handleCloseModal
        }>Hủy</Button>
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

export default Example;
