import dbConnect from '@/lib/dbConnect.ts'
import {
    BrandModel,
    CategoryModel,
    ProductModel,
    UserModel,
} from '../../Models/index.ts'
import { deleteImages, handleImages, saveImages } from '@/helpers/images.ts'
import { NextResponse } from 'next/server'
import { Tconfig, form, isValidDocument } from './index.ts'
import { getAllBrands, getAllCategories } from '@/helpers/cachedGeters.ts'
import brandNameValidators from '../../validations/brand/brandNameValidation/serverBrandValidation.ts'

export default async function addController<T>(props: any, config: Tconfig<T>) {
    const { DIR_PATH, model, multImages } = config

    const imageFiles = ((multImages ? props['images'] : [props['image']]) ||
        []) as (File | string)[]

    const images = handleImages(imageFiles)
    console.log('====>', images)
    if (multImages) {
        props.images = images.map((image) => image.name)
    } else {
        props.image = images[0].name
    }
    console.log(props)

    if (!(await saveImages(images, DIR_PATH))) {
        return new NextResponse('Server error', { status: 500 })
    }
    if (props.brand) {
        const brand = (await getAllBrands()).find(
            (brand) => brand.name === props.brand
        )
        props.brand = brand?._id || ''
    }
    if (props.category) {
        const category = (await getAllCategories()).find(
            (cat) => cat.name === props.category
        )
        props.category = category?._id || ''
    }
    try {
        const res = await model.newObject(props)
        if (!res) {
            deleteImages(
                images.map((image) => image.name),
                DIR_PATH
            )
            throw 'Could not save images'
        }
        return NextResponse.json(res, { status: 201 })
    } catch (error) {
        console.error(error)
        return new NextResponse('DB error', { status: 500 })
    }
}
