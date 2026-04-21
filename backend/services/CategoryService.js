const Category=require("../models/Category")
const { NotFoundError } = require("../utils/errors")

class CategoryService{
    static createCategory=async(data)=>{
        try {
            const {name, description, isActive}=data
            const category=new Category({name,description,isActive})
            await category.save()
            return category
        } catch (error) {
            throw error
        }
    }

    static updateCategory=async(id, data)=>{
        try {
            const {name, description, isActive}=data
            const category=await Category.findByIdAndUpdate(id, {name,description,isActive}, {new:true,runValidators:true})
            if(!category) throw new NotFoundError("Category not found")
            return category
        } catch (error) {
            throw error
        }
    }

    static deleteCategory=async(id)=>{
        try {
            const category=await Category.findByIdAndDelete(id)
            if(!category) throw new NotFoundError("Category not found")
            return category
        } catch (error) {
            throw error
        }
    }

    static getAllCategories = async () => {
        try {
            const categories = await Category.aggregate([
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: 'category',
                        as: 'productData'
                    }
                },
                {
                    $addFields: {
                        count: { 
                            $size: {
                                $filter: {
                                    input: '$productData',
                                    as: 'p',
                                    cond: { $eq: ['$$p.isActive', true] }
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        productData: 0
                    }
                }
            ]);
            return categories;
        } catch (error) {
            throw error;
        }
    }

    static getCategoryById=async(id)=>{
        try {
            const category=await Category.findById(id)
            if(!category) throw new NotFoundError("Category not found")
            return category
        } catch (error) {
            throw error
        }
    }
}


module.exports=CategoryService;