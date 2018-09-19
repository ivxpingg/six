package com.ikey.springbootmodule.controller;

import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.baomidou.mybatisplus.plugins.Page;
import com.ikey.springbootcommon.util.ExceptionType;
import com.ikey.springbootcommon.util.JsonUtil;
import com.ikey.springbootmodule.entity.Dict;
import com.ikey.springbootmodule.exception.GlobalException;
import com.ikey.springbootmodule.service.DictService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dict")
public class DictController {

    @Autowired
    private DictService dictService;

    /**
     * 列表
     * @param request
     * @param response
     * @return
     */
   // @RequiresPermissions("sys:dict:view")
    @RequestMapping(value = {"list", ""})
    public String list(@RequestBody(required=false) Page<Dict> page, HttpServletRequest request, HttpServletResponse response) {
        Map<String,Object> map = new HashMap<String, Object>();
        if(page==null){
            page = new Page<Dict>();
        }
        List<String> typeList = dictService.getTypeList();
        map.put("typeList", typeList);
        EntityWrapper ew=new EntityWrapper();
        ew.setEntity(new Dict());
        if(page.getCondition() != null){
            ew.eq("type",page.getCondition().get("type").toString());
            ew.eq("del_flag","0");
            ew.orderBy("type",true);
            ew.orderBy("sort",true);
        }
        Page<Dict> pageObj = dictService.selectPage(page, ew);
        map.put("page", pageObj);
        return JsonUtil.getSuccJson(ExceptionType.SUCCESS,map);
    }

    /**
     * 查询
     * @param id
     * @return
     */
    @GetMapping("query")
    public String get(@RequestParam(required=true) String id) {
       return JsonUtil.getSuccJson(ExceptionType.SUCCESS,dictService.selectById(id));
    }

    /**
     * 添加
     * @param dict
     * @return
     */
    //@RequiresPermissions("sys:dict:edit")
    @RequestMapping(value = "add")
    public String add(@RequestBody Dict dict) throws GlobalException {
        dict.setDelFlag("0");
        boolean result = dictService.insert(dict);
        if(!result){
            throw new GlobalException(ExceptionType.E0002);
        }
        return JsonUtil.getSuccJson(ExceptionType.SUCCESS,dict);
    }

    /**
     * 修改
     * @param dict
     * @return
     */
    //@RequiresPermissions("sys:dict:edit")
    @RequestMapping(value = "update")
    public String update(@RequestBody Dict dict) throws GlobalException {
        boolean result = dict.updateById();
        if(!result){
            throw new GlobalException(ExceptionType.E0003);
        }
        return JsonUtil.getSuccJson(ExceptionType.SUCCESS,dict);
    }


    //@RequiresPermissions("sys:dict:edit")
    @RequestMapping(value = "delete")
    public String delete(@RequestParam(required=true) String id) {
        boolean result = dictService.deleteById(id);
        if(!result){
            throw new GlobalException(ExceptionType.E0004);
        }
        return JsonUtil.getSuccJson(ExceptionType.SUCCESS,null);
    }


}
