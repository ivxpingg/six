package com.ikey.springbootmodule.controller;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.mapper.EntityWrapper;
import com.ikey.springbootcommon.util.ExceptionType;
import com.ikey.springbootcommon.util.JsonUtil;
import com.ikey.springbootmodule.entity.Menu;
import com.ikey.springbootmodule.entity.User;
import com.ikey.springbootmodule.exception.GlobalException;
import com.ikey.springbootmodule.service.MenuService;
import com.ikey.springbootmodule.service.UserService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Auther: laughing
 * @Date: 2018-9-12 14:05
 * @Description:  菜单
 */
@RestController
@RequestMapping("/user")
public class UserController{

    @Autowired
    private UserService userService;


    /**
     * 查询当前登录用户的信息
     * @return
     */
    @GetMapping("/query")
    public String query(){
//        Subject subject = SecurityUtils.
//        User user = (User)subject.getPrincipal();
//        JSONObject jsonObject = new JSONObject();
//        jsonObject.put("name",user.getName());
//        jsonObject.put("headPortrait",user.getHeadPortrait());
        return JsonUtil.getSuccJson(ExceptionType.SUCCESS,null);
    }


}
