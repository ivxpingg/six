package com.ikey.springbootmodule.controller;

import com.ikey.springbootcommon.util.ExceptionType;
import com.ikey.springbootcommon.util.JsonUtil;
import com.ikey.springbootmodule.entity.UserRole;
import com.ikey.springbootmodule.exception.GlobalException;
import com.ikey.springbootmodule.service.UserRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @Auther: laughing
 * @Date: 2018-9-12 14:05
 * @Description:  用户角色
 */
@RestController
@RequestMapping("/userRole")
public class UserRoleController {

    @Autowired
    private UserRoleService userRoleService;


    /**
     * 人员分配角色
     * @param userRoles
     * @return
     */
    @PostMapping(value = "add")
    public String add(@RequestBody List<UserRole> userRoles){
        boolean b = userRoleService.insertBatch(userRoles);
        if(!b){
            throw new GlobalException(ExceptionType.E0002);
        }
        return JsonUtil.getSuccJson();
    }


    /**
     * 人员移除角色
     * @param userRoles
     * @return
     */
    @PostMapping(value = "delete")
    public String delete(@RequestBody List<UserRole> userRoles){
        boolean b = userRoleService.deleteBatch(userRoles);
        if(!b){
            throw new GlobalException(ExceptionType.E0002);
        }
        return JsonUtil.getSuccJson();
    }
}
