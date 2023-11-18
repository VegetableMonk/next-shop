import { NextRequest, NextResponse } from 'next/server'

import { Category, CategoryModel } from '@/lib/DAL/Models'
import {
    addController,
    deleteController,
    getController,
    patchController,
    form,
} from '@/lib/DAL/controllers/universalControllers'

const config = {
    DIR_PATH: './public/categories/',
    model: CategoryModel,
    multImages: false,
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const _id = searchParams.get('_id') || undefined
    const name = searchParams.get('name') || undefined

    return getController({ name, _id }, config)
}

export async function PUT(req: NextRequest): Promise<NextResponse<any>> {
    const form = await req.formData()
    const props: Partial<form> = {}
    for (const [key, value] of form.entries()) {
        if (key === 'image') {
            props['image'] = value || undefined
        } else {
            props[key] = value.toString() || undefined
        }
    }
    return addController(props, config)
}

export async function DELETE(req: NextRequest): Promise<NextResponse<any>> {
    const { _id } = await req.json()
    return deleteController(_id, config)
}

export async function PATCH(req: NextRequest): Promise<NextResponse<any>> {
    const form = await req.formData()
    const props: { [a: string]: string | undefined | File } = {}
    for (const [key, value] of form.entries()) {
        if (key === 'image') {
            props[key] = value || undefined
        } else {
            props[key] = value.toString() || undefined
        }
    }
    return patchController(props, config)
}
