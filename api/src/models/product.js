const tableName = "products";
const mysql = require('../config/database');
const Category = require('../models/category');
const SubCategory = require('../models/subcategory');

module.exports.suggestions = async function(params){
  if(params.text){
    const category = await Category.searchLike({column: 'name', operator: 'like', value: '%'+params.text+'%'});
    const subcategory = await SubCategory.searchLike({column: 'name', operator: 'like', value: '%'+params.text+'%'});
    const products = await this.searchLike({column: 'name', operator: 'like', value: '%'+params.text+'%'});

    return {category: category, subcategory: subcategory, product: products};
  }
  return null;
}

module.exports.searchLike = async function(params){
  console.log(mysql(tableName).where(params.column, params.operator, params.value).select("id","name").orderBy('createdAt').toSQL())
  return mysql(tableName).where(params.column, params.operator, params.value).select("id","name").orderBy('createdAt');
}

module.exports.searchByIds = async function(params){
  return mysql(tableName).where(params.column, params.operator, params.value).select("id","name","price","images").orderBy('createdAt');
}

module.exports.commonSearch = async function(params){
  const filter = {status:"active"};
  if(params.language) {
    filter.language = params.language;
  } else {
    filter.language = "en";
  }

  let priceFilter = {
    isExists: false,
    value: []
  };
  if(params.filters){
    if(params.filters.length > 0){
      params.filters.forEach((filterBy) => {
        if(filterBy.key === 'price'){
          if(filterBy.value.length > 0){
            priceFilter.isExists = true;
            priceFilter.value = filterBy.value;
          }
        }
      });
    }
  }
  
  //console.log(mysql(tableName).where(filter).select("name","price","images", "description","attributes","discount").orderBy('createdAt', "desc").toSQL())
  return mysql(tableName).where(filter)
  .andWhere(function() {
    if(params.filters.length > 0){
      params.filters.forEach((filterBy) => {
        
        if(filterBy.key === 'name'){
          if(filterBy.value){
            this.where('name', 'LIKE', '%'+filterBy.value+'%')
          }
        }

        if(filterBy.key === 'categoryId'){
          if(filterBy.value){
            this.where('categoryId', filterBy.value)
          }
        }

        if(filterBy.key === 'subcategoryId'){
          if(filterBy.value){
            this.where('subcategoryId', filterBy.value)
          }
        }

        if(filterBy.key === 'price'){
          if(filterBy.value.length > 0){
            if(filterBy.value[0]){
              this.where('price', '>', filterBy.value[0])
            }
            if(filterBy.value[1]){
              this.where('price', '<', filterBy.value[1])
            }
          }
        }


      });
    }
  })
  .select("id","name","price","images", "description","attributes","discount").orderBy('createdAt', "desc");
}

module.exports.search = async function(params){
  return mysql(tableName).where(params).select();
}

module.exports.create = async function(params){
  return mysql(tableName).insert(params);
}

module.exports.update = async function(params){
  return mysql(tableName).where(params.where).update(params.data)
}

module.exports.delete = async function(params){
  return mysql(tableName).where(params.where).update(params.data)
}