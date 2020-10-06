package com.ikey.springbootmodule.controller;

import com.baomidou.mybatisplus.plugins.Page;
import com.ikey.springbootcommon.util.ExceptionType;
import com.ikey.springbootcommon.util.JsonUtil;
import com.ikey.springbootmodule.entity.User;
import com.ikey.springbootmodule.exception.GlobalException;
import com.ikey.springbootmodule.service.UnitService;
import com.ikey.springbootmodule.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * @Auther: laughing
 * @Date: 2018-9-12 14:05
 * @Description:  单位管理
 */
@RestController
@RequestMapping("/unit")
public class UnitController {

    @Autowired
    private UnitService unitService;
    @Autowired
    private UserService userService;


    /**
     * 单位列表管理
     * @return
     */
    @PostMapping(value = "list")
    public String list(@RequestBody(required=false) Page<Map<String,Object>> page){
        if(page==null){
            page = new Page<Map<String,Object>>();
        }
        Page<Map<String,Object>> pageObj = unitService.unitPage(page);
        return JsonUtil.getSuccJson(pageObj);
    }


    /**
     * 单位的基本信息
     * @param unitId
     * @return
     */
    @GetMapping(value = "query")
    public String query(@RequestParam String unitId){
        return JsonUtil.getSuccJson(unitService.selectById(unitId));
    }


    /**
     * 单位添加人员
     * 1.人员供职单位添加一条记录
     * 2.修改用户的单位id
     * @return
     */
    @GetMapping(value = "addUser/{userId}")
    public String addUser(@RequestParam String unitId,@PathVariable(name="userId")String userId){
        boolean b = unitService.addUser(userId,unitId);
        if(!b){
            throw new GlobalException(ExceptionType.E0003);
        }
        return JsonUtil.getSuccJson();
    }


    /**
     * 单位移除人员
     * @return
     */
    @GetMapping(value = "deleteUser/{userId}")
    public String deleteUser(@RequestParam String unitId,@PathVariable(name="userId")String userId){
        boolean b = unitService.deleteUser(userId,unitId);
        if(!b){
            throw new GlobalException(ExceptionType.E0003);
        }
        return JsonUtil.getSuccJson();
    }


    //单位添加信用评价 TODO


    //单位附件信息 TODO


    //添加单位 TODO

}
